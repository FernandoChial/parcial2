

CREATE TABLE clientes (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR NOT NULL,
    email VARCHAR NOT NULL UNIQUE,
    telefono VARCHAR NOT NULL
);

CREATE TABLE ordenes (
    id SERIAL PRIMARY KEY,
    cliente INT REFERENCES clientes(id),
    patillo_nombre VARCHAR NOT NULL,
    note TEXT,
    estado VARCHAR,
    creado TIMESTAMP DEFAULT NOW()
);


-- Insert para clientes
INSERT INTO clientes (nombre, email, telefono) VALUES
('Juan Pérez', 'juan.perez@email.com', '5551234567'),
('Ana Gómez', 'ana.gomez@email.com', '5559876543');

-- Insert para ordenes
INSERT INTO ordenes (cliente, patillo_nombre, note, estado) VALUES
(1, 'Pizza Margarita', 'Sin cebolla', 'pendiente'),
(2, 'Ensalada César', 'Agregar pollo', 'completado');

/* ahora necesito una pantalla para registrar y autenticar  clientes, usa nav bar o algo para separar , 
    y una pantalla para  vizualizar pedidos de un cliente
    y crear nuevos pedidos 
    y cambiar estado de nuevos pedidos eso agregalo donde se vizualiza el pedido de un cliene
    usa navbar o algo para separara todo eso con bae a mi back end y tablas 
*/









--post / clientes / registrar  un nuevo cliente  validando que el email no este repetido
--post / clientes / login  validar el acceso mediando el email y el telefono
--post  / ordenes / registrar un nuevo pedido para un cliente
--get / ordenes/:clienteId  listar los pedidos de un cliente
--put / ordnes /:id/estado - actualizar el estado de un pedido (pending -> preparanding -> delivered)




