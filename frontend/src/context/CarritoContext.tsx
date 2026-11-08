import React, { createContext, useContext, useState } from "react";

type Producto = {
  id: number | string;
  nombre: string;
  precio: number;
  cantidad: number;
  colorSeleccionado: string;
  tallaSeleccionada: string;
  [key: string]: any;
};

type CarritoContextType = {
  carrito: Producto[];
  agregarAlCarrito: (producto: Producto) => void;
  eliminarDelCarrito: (id: any, color: any, talla: any) => void;
  limpiarCarrito: () => void;
  total: number;
};

const CarritoContext = createContext<CarritoContextType>({
  carrito: [],
  agregarAlCarrito: () => {},
  eliminarDelCarrito: () => {},
  limpiarCarrito: () => {},
  total: 0,
});

export const CarritoProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [carrito, setCarrito] = useState<Producto[]>([]);

  const agregarAlCarrito = (producto: Producto) => {
    setCarrito((prev) => {
      const existe = prev.find(
        (p) =>
          p.id === producto.id &&
          p.colorSeleccionado === producto.colorSeleccionado &&
          p.tallaSeleccionada === producto.tallaSeleccionada
      );

      if (existe) {
        return prev.map((p) =>
          p.id === producto.id &&
          p.colorSeleccionado === producto.colorSeleccionado &&
          p.tallaSeleccionada === producto.tallaSeleccionada
            ? { ...p, cantidad: p.cantidad + producto.cantidad }
            : p
        );
      }

      return [...prev, producto];
    });
  };

  const eliminarDelCarrito = (
    id: any,
    color: any,
    talla: any
  ) => {
    setCarrito((prev) =>
      prev.filter(
        (p) =>
          !(
            p.id === id &&
            p.colorSeleccionado === color &&
            p.tallaSeleccionada === talla
          )
      )
    );
  };

  const limpiarCarrito = () => {
    setCarrito([]);
  };

  const total = carrito.reduce(
    (acc, p) => acc + p.precio * p.cantidad,
    0
  );

  return (
    <CarritoContext.Provider
      value={{
        carrito,
        agregarAlCarrito,
        eliminarDelCarrito,
        limpiarCarrito,
        total,
      }}
    >
      {children}
    </CarritoContext.Provider>
  );
};

export const useCarrito = () => useContext(CarritoContext);