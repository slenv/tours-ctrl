import { BASE_ROUTE, ROUTE } from "@/config/routes";
import { VITE_DEV_PHONE, VITE_APP_NAME } from "@/config/env";

const MENU_TYPE = {
  COLLAPSE: 'collapse',
  ITEM: 'item',
  GROUP: 'group'
}

const menuItems = {
  items: [
    {
      id: 'navigation',
      title: 'Principal',
      type: MENU_TYPE.GROUP,
      children: [
        {
          id: 'dashboard',
          title: 'Panel de Control',
          type: MENU_TYPE.ITEM,
          icon: '📊️',
          url: `/${BASE_ROUTE.APP}/${ROUTE.DASHBOARD}`,
        },
        {
          id: 'reports',
          title: 'Reportes',
          type: MENU_TYPE.COLLAPSE,
          icon: '📂️',
          children: [

          ]
        },
      ]
    },
    {
      id: 'access',
      title: 'Accesos',
      type: 'group',
      children: [
        {
          id: 'maintenance',
          title: 'Mantenimiento',
          type: MENU_TYPE.COLLAPSE,
          icon: '🗄️',
          children: [
            {
              id: 'payment-accounts',
              title: 'Cuentas de Pago',
              type: MENU_TYPE.ITEM,
              url: `/${BASE_ROUTE.APP}/${BASE_ROUTE.SETTINGS}/${ROUTE.PAYMENT_ACCOUNTS}`
            },
            {
              id: 'vehicles',
              title: 'Vehículos',
              type: MENU_TYPE.ITEM,
              url: `/${BASE_ROUTE.APP}/${BASE_ROUTE.SETTINGS}/${ROUTE.VEHICLES}`
            },
          ]
        },
        {
          id: 'people',
          title: 'Personas',
          type: MENU_TYPE.COLLAPSE,
          icon: '👥️',
          children: [
            {
              id: 'customers',
              title: 'Clientes',
              type: MENU_TYPE.ITEM,
              url: `/${BASE_ROUTE.APP}/${BASE_ROUTE.PEOPLE}/${ROUTE.CUSTOMERS}`
            },
            {
              id: 'passengers',
              title: 'Pasajeros',
              type: MENU_TYPE.ITEM,
              url: `/${BASE_ROUTE.APP}/${BASE_ROUTE.PEOPLE}/${ROUTE.PASSENGERS}`
            },
            {
              id: 'drivers',
              title: 'Conductores',
              type: MENU_TYPE.ITEM,
              url: `/${BASE_ROUTE.APP}/${BASE_ROUTE.PEOPLE}/${ROUTE.DRIVERS}`
            },
            {
              id: 'guides',
              title: 'Guías',
              type: MENU_TYPE.ITEM,
              url: `/${BASE_ROUTE.APP}/${BASE_ROUTE.PEOPLE}/${ROUTE.GUIDES}`
            },
          ]
        },
        {
          id: 'tours',
          title: 'Tours / Viajes',
          type: MENU_TYPE.ITEM,
          icon: '🚌',
          url: `/${BASE_ROUTE.APP}/${ROUTE.TOURS}`
        },
        {
          id: 'reservations',
          title: 'Reservas',
          type: MENU_TYPE.ITEM,
          icon: '🗓️',
          url: `/${BASE_ROUTE.APP}/${ROUTE.RESERVATIONS}`
        },
        {
          id: 'treasury',
          title: 'Tesorería',
          type: MENU_TYPE.COLLAPSE,
          icon: '💵',
          children: [
            {
              id: 'payments',
              title: 'Pagos',
              type: MENU_TYPE.ITEM,
              url: `/${BASE_ROUTE.APP}/${ROUTE.RESERVATION_PAYMENTS}`
            }
          ]
        },
      ]
    },
    {
      id: 'others',
      title: 'Otros',
      type: MENU_TYPE.GROUP,
      children: [
        {
          id: 'support',
          title: 'Soporte',
          type: MENU_TYPE.ITEM,
          icon: '👨‍💻️',
          classes: 'nav-item',
          url: `https://wa.me/${VITE_DEV_PHONE}?text=Hola, necesito soporte para el sistema "${VITE_APP_NAME}"`,
          external: true
        },
        {
          id: 'membership',
          title: 'Términos de uso',
          type: MENU_TYPE.ITEM,
          icon: '📋️',
          classes: 'nav-item',
          url: `/${BASE_ROUTE.APP}/${ROUTE.TERMS}`,
        },
      ]
    }
  ]
}

export default menuItems;
