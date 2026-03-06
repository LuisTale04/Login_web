import './Sidebar.css';

/**
 * Componente Sidebar del sistema POS.
 * Muestra navegación principal con módulos y la info del usuario logueado.
 */
function Sidebar({ username, onLogout, activeModule, onModuleChange }) {

  const mainModules = [
    { id: 'sales',     icon: 'point_of_sale', label: 'Ventas' },
    { id: 'inventory', icon: 'inventory_2',   label: 'Inventario' },
    { id: 'reports',   icon: 'bar_chart',     label: 'Reportes' },
    { id: 'customers', icon: 'groups',        label: 'Clientes' },
    { id: 'orders',    icon: 'receipt_long',   label: 'Órdenes' },
  ];

  const systemModules = [
    { id: 'settings', icon: 'settings',      label: 'Configuración' },
    { id: 'help',     icon: 'help_outline',  label: 'Ayuda y Soporte' },
  ];

  return (
    <aside className="sidebar">
      {/* Brand */}
      <div className="sidebar-brand">
        <div className="sidebar-logo">
          <span className="material-icons-outlined">store</span>
        </div>
        <span className="sidebar-brand-text">BRIAROS POS</span>
      </div>

      {/* Main Navigation */}
      <nav className="sidebar-nav">
        <div className="sidebar-section">
          {mainModules.map((mod) => (
            <button
              key={mod.id}
              className={`sidebar-item ${activeModule === mod.id ? 'active' : ''}`}
              onClick={() => onModuleChange(mod.id)}
            >
              <span className="material-icons-outlined sidebar-item-icon">{mod.icon}</span>
              <span className="sidebar-item-label">{mod.label}</span>
            </button>
          ))}
        </div>

        <div className="sidebar-divider"></div>

        <p className="sidebar-section-title">SISTEMA</p>
        <div className="sidebar-section">
          {systemModules.map((mod) => (
            <button
              key={mod.id}
              className={`sidebar-item ${activeModule === mod.id ? 'active' : ''}`}
              onClick={() => onModuleChange(mod.id)}
            >
              <span className="material-icons-outlined sidebar-item-icon">{mod.icon}</span>
              <span className="sidebar-item-label">{mod.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* User Footer */}
      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-avatar">
            {(username || 'U').charAt(0).toUpperCase()}
          </div>
          <div className="sidebar-user-info">
            <span className="sidebar-user-name">{username || 'Usuario'}</span>
            <span className="sidebar-user-role">Administrador</span>
          </div>
          <button className="sidebar-logout" onClick={onLogout} title="Cerrar sesión">
            <span className="material-icons-outlined">logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
