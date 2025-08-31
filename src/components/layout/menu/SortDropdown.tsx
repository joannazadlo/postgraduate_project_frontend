import { Dropdown } from "react-bootstrap";
import { SortOption } from "../../../utils/sortingHelper";

type SortDropdownProps = {
  sortOption: SortOption;
  onSortChange: (option: SortOption) => void;
}

export default function SortDropdown({ sortOption, onSortChange }: SortDropdownProps) {
  return (
    <Dropdown align="end">
      <Dropdown.Toggle
        variant="link"
        className="text-dark fw-semibold p-0 d-flex align-items-center"
        style={{ textDecoration: 'none' }}
        id="dropdown-sort-by"
      >
        <span className="fw-semibold small">SORT BY</span>
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item
          active={sortOption === 'title-asc'}
          onClick={() => onSortChange('title-asc')}
        >
          Title: A → Z
        </Dropdown.Item>
        <Dropdown.Item
          active={sortOption === 'title-desc'}
          onClick={() => onSortChange('title-desc')}
        >
          Title: Z → A
        </Dropdown.Item>
        <Dropdown.Item
          active={sortOption === 'date-newest'}
          onClick={() => onSortChange('date-newest')}
        >
          Date: Newest First
        </Dropdown.Item>
        <Dropdown.Item
          active={sortOption === 'date-oldest'}
          onClick={() => onSortChange('date-oldest')}
        >
          Date: Oldest First
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>

  )
}
