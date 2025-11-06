import { useState } from 'react';
import { Button, ButtonGroup, Form, Modal } from 'react-bootstrap';
import GridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

export default function VehicleSeats({ maxSeats, vehicleSeats }) {
  const [layout, setLayout] = useState(() => {
    // Si hay vehicleSeats, cargarlos
    if (vehicleSeats && vehicleSeats.length > 0) {
      return vehicleSeats.map((seat, idx) => ({
        i: seat.id || `seat-${idx}`,
        x: (seat.col || 1) - 1,
        y: (seat.row || 1) - 1,
        w: seat.colspan || 1,
        h: seat.rowspan || 1,
        label: seat.number || seat.label || `${idx + 1}`
      }));
    }
    // Si no hay vehicleSeats, crear asientos por defecto
    return Array.from({ length: maxSeats }, (_, idx) => ({
      i: `seat-${idx}`,
      x: idx % 5,
      y: Math.floor(idx / 5),
      w: 1,
      h: 1,
      label: `${idx + 1}`
    }));
  });
  const [showModal, setShowModal] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [seatLabel, setSeatLabel] = useState('');
  const [gridCols, setGridCols] = useState(5);
  const [gridRows, setGridRows] = useState(10);

  const getMinGridSize = () => {
    if (layout.length === 0) return { minCols: 3, minRows: 5 };

    const maxX = Math.max(...layout.map(item => item.x + item.w));
    const maxY = Math.max(...layout.map(item => item.y + item.h));

    return { minCols: maxX, minRows: maxY };
  };

  const handleColsChange = (value) => {
    const newCols = parseInt(value) || 3;
    const { minCols } = getMinGridSize();

    if (newCols < minCols) {
      alert(`No puedes reducir a ${newCols} columnas porque tienes asientos hasta la columna ${minCols}`);
      return;
    }

    setGridCols(Math.max(3, newCols));
  };

  const handleRowsChange = (value) => {
    const newRows = parseInt(value) || 5;
    const { minRows } = getMinGridSize();

    if (newRows < minRows) {
      alert(`No puedes reducir a ${newRows} filas porque tienes asientos hasta la fila ${minRows}`);
      return;
    }

    setGridRows(Math.max(5, newRows));
  };

  const findFreePosition = () => {
    for (let y = 0; y < gridRows; y++) {
      for (let x = 0; x < gridCols; x++) {
        const occupied = layout.some(item =>
          x >= item.x && x < item.x + item.w &&
          y >= item.y && y < item.y + item.h
        );
        if (!occupied) {
          return { x, y };
        }
      }
    }
    return { x: 0, y: 0 };
  };

  const handleAddSeat = () => {
    if (layout.length >= maxSeats) {
      alert(`No se pueden agregar más de ${maxSeats} asientos`);
      return;
    }
    const pos = findFreePosition();
    const newSeat = {
      i: `seat-${Date.now()}`,
      x: pos.x,
      y: pos.y,
      w: 1,
      h: 1,
      label: ''
    };
    setLayout([...layout, newSeat]);
  };

  const handleSeatClick = (item) => {
    setCurrentItem(item);
    setSeatLabel(item.label || '');
    setShowModal(true);
  };

  const handleSaveLabel = () => {
    setLayout(layout.map(item =>
      item.i === currentItem.i
        ? { ...item, label: seatLabel }
        : item
    ));
    setShowModal(false);
  };

  const handleDeleteSeat = () => {
    setLayout(layout.filter(item => item.i !== currentItem.i));
    setShowModal(false);
  };

  const handleLayoutChange = (newLayout) => {
    setLayout(layout.map(item => {
      const updated = newLayout.find(nl => nl.i === item.i);
      return updated ? { ...item, ...updated } : item;
    }));
  };

  const handleSave = () => {
    const seats = layout.map((item, idx) => ({
      number: item.label || `Asiento ${idx + 1}`,
      row: item.y + 1,
      col: item.x + 1,
      colspan: item.w,
      rowspan: item.h,
      status: 'active'
    }));
    console.log('Asientos guardados:', seats);
  };

  const cellWidth = 80;
  const cellHeight = 60;
  const gridWidth = gridCols * cellWidth;

  return (
    <div className="my-3">
      <div className="d-flex gap-3 mb-3 align-items-center">
        <ButtonGroup size="sm" className="gap-2">
          <Button
            variant="outline-primary"
            onClick={handleAddSeat}
            disabled={layout.length >= maxSeats}
          >
            <i className="feather icon-plus-circle me-2"></i>
            Nuevo asiento
          </Button>
          <Button
            variant="outline-danger"
            onClick={() => setLayout([])}
            disabled={layout.length === 0}
          >
            <i className="feather icon-trash me-2"></i>
            Limpiar todo
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={layout.length === 0}
          >
            <i className="feather icon-save me-2"></i>
            Guardar ({layout.length}/{maxSeats})
          </Button>
        </ButtonGroup>

        <div className="d-flex gap-2 align-items-center ms-auto">
          <small className="text-muted">Columnas:</small>
          <input
            type="number"
            className="form-control form-control-sm"
            style={{ width: '70px' }}
            value={gridCols}
            onChange={(e) => handleColsChange(e.target.value)}
            min="3"
            max="20"
          />
          <small className="text-muted">Filas:</small>
          <input
            type="number"
            className="form-control form-control-sm"
            style={{ width: '70px' }}
            value={gridRows}
            onChange={(e) => handleRowsChange(e.target.value)}
            min="5"
            max="30"
          />
        </div>
      </div>

      <div
        className="border rounded p-3"
        style={{
          backgroundColor: '#f8f9fa',
          position: 'relative',
          overflow: 'auto'
        }}
      >
        <div
          style={{
            width: `${gridWidth}px`,
            height: `${gridRows * cellHeight}px`,
            position: 'relative'
          }}
        >
          <GridLayout
            className="layout"
            layout={layout}
            cols={gridCols}
            rowHeight={cellHeight}
            width={gridWidth}
            onLayoutChange={handleLayoutChange}
            compactType={null}
            preventCollision={true}
            isResizable={true}
            draggableHandle=".drag-handle"
            resizeHandles={['se']}
          >
            {layout.map(item => (
              <div
                key={item.i}
                className="bg-secondary"
                style={{
                  color: 'white',
                  borderRadius: '6px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  userSelect: 'none',
                  border: '2px solid #6c757d',
                  position: 'relative'
                }}
              >
                <div
                  className="drag-handle"
                  style={{
                    flex: 1,
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'move',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    padding: '4px'
                  }}
                >
                  {item.label || '?'}
                </div>
                <span
                  role="button"
                  className="position-absolute bg-dark rounded"
                  style={{ fontSize: '11px', top: '2px', left: '2px' }}
                  onClick={() => handleSeatClick(item)}
                  title="Editar asiento"
                >
                  <i className="feather icon-more-vertical"></i>
                </span>
              </div>
            ))}
          </GridLayout>
        </div>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Configurar Asiento</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Etiqueta</Form.Label>
            <Form.Control
              type="text"
              value={seatLabel}
              onChange={(e) => setSeatLabel(e.target.value)}
              placeholder="Ej: A1, Conductor..."
              autoFocus
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleDeleteSeat}>
            Eliminar
          </Button>
          <Button variant="primary" onClick={handleSaveLabel}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}