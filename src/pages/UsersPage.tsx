import { useEffect, useState } from 'react';
import { Container, Spinner } from 'react-bootstrap';
import { blockUser, getUsers } from '../services/userService';
import { User } from '../types/types';
import { useAuth } from '../context/AuthContext';
import UsersTable from '../components/users/UsersTable';
import BlockUserConfirmationModal from '../components/confirmation-modals/BlockUserConfirmationModal';
import ToastMessage from '../components/ui/toast/ToastMessage';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { currentUser } = useAuth();
  const [showBlockUserModal, setBlockUserModal] = useState<boolean>(false);
  const [userToBlock, setUserToBlock] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'danger'>('success');

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const data = await getUsers();
        setUsers(data);
        setLoading(false);
      } catch {
        setError('Error fetching users. Please try again later.');
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleBlockUser = async (userId: string): Promise<void> => {
    try {
      const updatedUser = await blockUser(userId);
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.uid === updatedUser.uid ? updatedUser : user
        )

      )
      setShowToast(true);
      setToastMessage("User blocked succesfully");
      setToastType("success");
    } catch {
      setShowToast(true);
      setToastMessage("Failed to block user");
      setToastType("danger");
    }
  }

  return (
    <Container fluid className="py-1">
      <h3 className=" display-6 small-display mb-0 ms-2">Manage Users</h3>
      {error && <div className="text-danger text-center py-3">{error}</div>}
      {loading ? (
        <div className="d-flex justify-content-center py-5">
          <Spinner animation="border" role="status" />
        </div>
      ) : (
        <div className="table-responsive d-flex justify-content-center py-3">
          <div style={{ maxWidth: '80vw', width: '100%' }}>
            <UsersTable
              users={users}
              currentUser={currentUser}
              onBlock={(userId: string) => {
                setBlockUserModal(true);
                setUserToBlock(userId);
                setShowToast(false);
              }}
            />
          </div>
        </div>
      )}

      <BlockUserConfirmationModal
        showModal={showBlockUserModal}
        onClose={() => setBlockUserModal(false)}
        onBlock={async () => {
          if (userToBlock) {
            await handleBlockUser(userToBlock);
            setBlockUserModal(false);
            setUserToBlock(null);
          }
        }}
      />

      <ToastMessage
        toastType={toastType}
        toastMessage={toastMessage}
        showToast={showToast}
        onClose={() => setShowToast(false)}
      />

    </Container>
  );
};
