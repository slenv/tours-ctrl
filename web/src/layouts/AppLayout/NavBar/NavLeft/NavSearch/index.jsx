import { useState } from "react";
import { Link } from "react-router-dom";
import { Button, FormControl } from "react-bootstrap";

export default function NavSearch() {
  const [isOpen, setIsOpen] = useState(false);

  let searchContent = null;
  if (isOpen) {
    searchContent = (
      <div className="search-bar">
        <FormControl autoFocus type="text" className="border-0 shadow-none" placeholder="Search here" />
        <Button variant="link" type="button" className="close" aria-label="Close" onClick={() => setIsOpen(false)}>
          <span aria-hidden="true">
            <i className="feather icon-x" />
          </span>
        </Button>
      </div>
    )
  }

  return (
    <>
      <Link to="#" className="pop-search" onClick={() => setIsOpen(true)}>
        <i className="feather icon-search" />
      </Link>
      {searchContent}
    </>
  )
}
