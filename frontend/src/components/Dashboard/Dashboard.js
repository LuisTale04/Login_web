import { useState } from 'react';
import Sidebar from './Sidebar';
import Modal from '../UI/Modal';
import './Dashboard.css';

/**
 * Componente Dashboard principal del sistema POS.
 * Muestra sidebar + contenido principal con stats de prueba.
 */
function Dashboard({ username, onLogout }) {
  const [activeModule, setActiveModule] = useState('sales');
  const [modal, setModal] = useState({ show: false, type: '', title: '', message: '' });

  const handleLogout = () => {
    setModal({
      show: false,
      type: '',
      title: '',
      message: '',
    });
    onLogout();
  };

  // ── Datos de prueba ──
  const stats = [
    {
      id: 1,
      label: 'Ventas del Día',
      value: 'Q 12,458.50',
      change: '+12.5%',
      positive: true,
      icon: 'trending_up',
      color: 'primary',
    },
    {
      id: 2,
      label: 'Órdenes Hoy',
      value: '84',
      change: '+8.2%',
      positive: true,
      icon: 'receipt_long',
      color: 'blue',
    },
    {
      id: 3,
      label: 'Productos Vendidos',
      value: '243',
      change: '-3.1%',
      positive: false,
      icon: 'inventory_2',
      color: 'amber',
    },
    {
      id: 4,
      label: 'Clientes Atendidos',
      value: '56',
      change: '+15.7%',
      positive: true,
      icon: 'groups',
      color: 'green',
    },
  ];

  const recentOrders = [
    { id: '#ORD-001', customer: 'Carlos Méndez', amount: 'Q 245.00', status: 'Completada', time: 'Hace 5 min' },
    { id: '#ORD-002', customer: 'María López', amount: 'Q 128.50', status: 'En proceso', time: 'Hace 12 min' },
    { id: '#ORD-003', customer: 'José García', amount: 'Q 89.00', status: 'Completada', time: 'Hace 20 min' },
    { id: '#ORD-004', customer: 'Ana Rodríguez', amount: 'Q 432.75', status: 'Completada', time: 'Hace 35 min' },
    { id: '#ORD-005', customer: 'Pedro Hernández', amount: 'Q 67.25', status: 'Pendiente', time: 'Hace 45 min' },
  ];

  const topProducts = [
    { name: 'Café Americano', sold: 45, revenue: 'Q 1,350.00' },
    { name: 'Pastel de Chocolate', sold: 32, revenue: 'Q 2,240.00' },
    { name: 'Pan Francés', sold: 28, revenue: 'Q 420.00' },
    { name: 'Croissant', sold: 24, revenue: 'Q 720.00' },
  ];

  const getStatusClass = (status) => {
    switch (status) {
      case 'Completada': return 'status-completed';
      case 'En proceso': return 'status-processing';
      case 'Pendiente': return 'status-pending';
      default: return '';
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  };

  return (
    <div className="dashboard-layout">
      <Sidebar
        username={username}
        onLogout={handleLogout}
        activeModule={activeModule}
        onModuleChange={setActiveModule}
      />

      <main className="dashboard-main">
        {/* Header */}
        <header className="dashboard-header">
          <div className="header-left">
            <h1 className="header-greeting">
              {getGreeting()}, <span className="header-user">{username}</span>
            </h1>
            <p className="header-desc">Aquí tienes un resumen de tu negocio hoy.</p>
          </div>
          <div className="header-right">
            <div className="header-date">
              <span className="material-icons-outlined">calendar_today</span>
              <span>{new Date().toLocaleDateString('es-GT', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</span>
            </div>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div
              key={stat.id}
              className={`stat-card stat-${stat.color}`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="stat-header">
                <div className={`stat-icon-wrapper stat-icon-${stat.color}`}>
                  <span className="material-icons-outlined">{stat.icon}</span>
                </div>
                <span className={`stat-change ${stat.positive ? 'positive' : 'negative'}`}>
                  {stat.change}
                </span>
              </div>
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Content Grid  */}
        <div className="content-grid">
          {/* Recent Orders */}
          <div className="content-card orders-card animate-fade-in-up"
               style={{ animationDelay: '400ms' }}>
            <div className="card-header">
              <h2 className="card-title">
                <span className="material-icons-outlined card-title-icon">receipt_long</span>
                Órdenes Recientes
              </h2>
              <button className="card-action" onClick={() => setActiveModule('orders')}>
                Ver todas
              </button>
            </div>
            <div className="orders-table">
              <table>
                <thead>
                  <tr>
                    <th>Orden</th>
                    <th>Cliente</th>
                    <th>Total</th>
                    <th>Estado</th>
                    <th>Tiempo</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id}>
                      <td className="order-id">{order.id}</td>
                      <td>{order.customer}</td>
                      <td className="order-amount">{order.amount}</td>
                      <td>
                        <span className={`order-status ${getStatusClass(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="order-time">{order.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Top Products */}
          <div className="content-card products-card animate-fade-in-up"
               style={{ animationDelay: '500ms' }}>
            <div className="card-header">
              <h2 className="card-title">
                <span className="material-icons-outlined card-title-icon">star</span>
                Productos Más Vendidos
              </h2>
            </div>
            <div className="products-list">
              {topProducts.map((product, index) => (
                <div className="product-item" key={index}>
                  <div className="product-rank">{index + 1}</div>
                  <div className="product-info">
                    <span className="product-name">{product.name}</span>
                    <span className="product-sold">{product.sold} vendidos</span>
                  </div>
                  <span className="product-revenue">{product.revenue}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Modal
        show={modal.show}
        type={modal.type}
        title={modal.title}
        message={modal.message}
        onClose={() => setModal({ ...modal, show: false })}
      />
    </div>
  );
}

export default Dashboard;
