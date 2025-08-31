import { Table, Button } from 'react-bootstrap';
import { User } from '../../types/types';
import styles from "./UsersTable.module.css"

type UserTableProps = {
  users: User[];
  onBlock: (uid: string) => void;
  currentUser: User | null;
}

export default function UsersTable({ users, onBlock, currentUser }: UserTableProps) {
  return (
    <div className="table-responsive">
      <Table className={`${styles.customUsersTable} table table-striped table-hover`}>
        <thead>
          <tr>
            <th>Email</th>
            <th>Status</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.uid}>
              <td>
                {user.email}
                {user.uid === currentUser?.uid && (
                  <span className={`${styles.customBadge} badge rounded-pill`}>You</span>
                )}
              </td>
              <td>{user.status}</td>
              <td>{user.role}</td>
              <td>
                <span
                  title={
                    user.uid === currentUser?.uid
                      ? "You can't block yourself"
                      : user.status === 'BLOCKED'
                        ? "User is already blocked"
                        : ''
                  }
                >
                  <Button
                    variant="danger"
                    disabled={user.uid === currentUser?.uid || user.status === 'BLOCKED'}
                    onClick={() => onBlock(user.uid)}
                  >
                    Block user
                  </Button>
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}
