export default function NavIcon({ items }) {
  let navIcons = null;
  if (items.icon) {
    navIcons = (
      <span className="pcoded-micon">
        {items.icon.includes('feather')
          ? <i className={items.icon} />
          : items.icon
        }
      </span>
    )
  }

  return navIcons;
}
