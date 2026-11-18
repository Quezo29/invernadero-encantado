import { useEffect, useRef, useState } from "react";
import { registrarRiego, repartirErrores } from "../api.js";
import { hoyIso } from "../formato.js";
import Campo from "./Campo.jsx";
import Mensaje from "./Mensaje.jsx";

const CAMPOS = ["cantidadMl", "fecha"];
const SUGERENCIA_ML = "500";

// Panel de HU-1.8: registra un riego sin salir de la lista de plantas.
export default function PanelRiego({ planta, alCerrar, alGuardar }) {
  const dialogo = useRef(null);
  const [datos, setDatos] = useState({
    cantidadMl: SUGERENCIA_ML,
    fecha: hoyIso(),
  });
  const [errores, setErrores] = useState({ porCampo: {}, generales: [] });
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    dialogo.current?.showModal();
  }, []);

  function cambiar(evento) {
    setDatos({ ...datos, [evento.target.name]: evento.target.value });
  }

  async function enviar(evento) {
    evento.preventDefault();
    setEnviando(true);
    setErrores({ porCampo: {}, generales: [] });
    try {
      const cantidad = datos.cantidadMl.trim();
      const riego = await registrarRiego({
        planta: planta._id,
        cantidadMl: cantidad === "" ? undefined : Number(cantidad),
        fecha: datos.fecha || undefined,
      });
      dialogo.current?.close();
      alGuardar(riego);
    } catch (error) {
      if (error.estado === 400) {
        setErrores(repartirErrores(error, CAMPOS));
      } else if (error.estado === 404) {
        setErrores({
          porCampo: {},
          generales: ["No encontramos esa planta. Puede que se haya borrado."],
        });
      } else {
        setErrores({
          porCampo: {},
          generales: [
            "No pudimos guardar el riego. Revisa que la API esté encendida y vuelve a intentarlo.",
          ],
        });
      }
      setEnviando(false);
    }
  }

  return (
    <dialog
      ref={dialogo}
      className="panel-riego"
      aria-labelledby="titulo-panel-riego"
      onClose={alCerrar}
      onCancel={(evento) => {
        if (enviando) evento.preventDefault();
      }}
    >
      <form onSubmit={enviar} noValidate>
        <h2 id="titulo-panel-riego">Registrar un riego</h2>
        <p className="texto-secundario">
          {planta.nombre} · {planta.ubicacion}
        </p>

        {errores.generales.map((mensaje) => (
          <Mensaje key={mensaje} tipo="error">
            {mensaje}
          </Mensaje>
        ))}

        <Campo
          id="cantidadMl"
          etiqueta="Cantidad (ml)"
          ayuda="Medio litro son 500 ml."
          type="number"
          inputMode="numeric"
          min="1"
          step="1"
          value={datos.cantidadMl}
          onChange={cambiar}
          error={errores.porCampo.cantidadMl}
          disabled={enviando}
        />
        <Campo
          id="fecha"
          etiqueta="Fecha"
          ayuda="Déjala como está si la regaste hoy."
          type="date"
          max={hoyIso()}
          value={datos.fecha}
          onChange={cambiar}
          error={errores.porCampo.fecha}
          disabled={enviando}
        />

        <div className="acciones-panel">
          <button type="submit" className="boton-primario" disabled={enviando}>
            {enviando ? "Guardando…" : "Guardar riego"}
          </button>
          <button
            type="button"
            className="boton-secundario"
            onClick={() => dialogo.current?.close()}
            disabled={enviando}
          >
            Cancelar
          </button>
        </div>
      </form>
    </dialog>
  );
}
