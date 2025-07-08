import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import '../styles/AdminStats.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface GananciasMensuales {
  mes: string;
  total: number;
}

// Datos de prueba
const datosPrueba = [
  { fecha: '2024-01-15', total: 1500 },
  { fecha: '2024-01-20', total: 2300 },
  { fecha: '2024-02-05', total: 1800 },
  { fecha: '2024-02-15', total: 2100 },
  { fecha: '2024-03-01', total: 3200 },
  { fecha: '2024-03-10', total: 2800 }
];

function AdminStats() {
  const [gananciasMensuales, setGananciasMensuales] = useState<GananciasMensuales[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      // Obtener el historial de compras del localStorage
      let historialCompras = JSON.parse(localStorage.getItem("historialCompras") || "[]");
      
      // Si no hay datos, usar los datos de prueba
      if (!Array.isArray(historialCompras) || historialCompras.length === 0) {
        console.log("Usando datos de prueba");
        historialCompras = datosPrueba;
      }
      
      // Crear un objeto para almacenar las ganancias por mes
      const gananciasPorMes: { [key: string]: number } = {};
      
      // Procesar cada compra
      historialCompras.forEach((compra: any) => {
        const fecha = new Date(compra.fecha);
        const mes = fecha.toLocaleString('es-ES', { month: 'long' });
        
        if (gananciasPorMes[mes]) {
          gananciasPorMes[mes] += Number(compra.total);
        } else {
          gananciasPorMes[mes] = Number(compra.total);
        }
      });
      
      // Convertir el objeto a un array de objetos y ordenar por mes
      const gananciasArray = Object.entries(gananciasPorMes)
        .map(([mes, total]) => ({
          mes,
          total
        }))
        .sort((a, b) => {
          const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 
                        'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
          return meses.indexOf(a.mes) - meses.indexOf(b.mes);
        });
      
      console.log("Ganancias procesadas:", gananciasArray);
      setGananciasMensuales(gananciasArray);
    } catch (error) {
      console.error("Error al procesar las ganancias:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const data = {
    labels: gananciasMensuales.map(item => item.mes),
    datasets: [
      {
        label: 'Ganancias Mensuales',
        data: gananciasMensuales.map(item => item.total),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.1,
        fill: true
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#fff'
        }
      },
      title: {
        display: true,
        text: 'Ganancias Mensuales',
        color: '#fff',
        font: {
          size: 16
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: '#fff',
          callback: function(value: any) {
            return '$' + value.toFixed(2);
          }
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      },
      x: {
        ticks: {
          color: '#fff'
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      }
    }
  };

  if (loading) {
    return (
      <section className="admin-stats-section">
        <h2><i className="fas fa-chart-line"></i> Estadísticas de Ventas</h2>
        <div className="stats-container">
          <p>Cargando estadísticas...</p>
        </div>
      </section>
    );
  }

  if (gananciasMensuales.length === 0) {
    return (
      <section className="admin-stats-section">
        <h2><i className="fas fa-chart-line"></i> Estadísticas de Ventas</h2>
        <div className="stats-container">
          <p>No hay datos de ventas disponibles.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="admin-stats-section">
      <h2><i className="fas fa-chart-line"></i> Estadísticas de Ventas</h2>
      <div className="stats-container">
        <div className="chart-container">
          <Line data={data} options={options} />
        </div>
        <div className="stats-summary">
          <h3>Resumen de Ganancias</h3>
          <div className="stats-grid">
            {gananciasMensuales.map((item, index) => (
              <div key={index} className="stat-card">
                <h4>{item.mes}</h4>
                <p>${item.total.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default AdminStats; 