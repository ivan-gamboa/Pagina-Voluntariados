/**
 * auth.js — Módulo de autenticación para Voluntariados La Matanza
 * Maneja usuarios pre-guardados en localStorage y actualiza el nav dinámicamente.
 */

// ─── Usuarios pre-cargados ────────────────────────────────────────────────────
const USUARIOS_PREDEFINIDOS = [
    {
        email: "test@unlam.edu.ar",
        password: "Test1234",
        nombre: "Usuario Test",
        apellido: "UNLAM",
    }
];

/**
 * Inicializa los usuarios predefinidos en localStorage si no existen ya.
 */
function inicializarUsuarios() {
    const usuariosGuardados = JSON.parse(localStorage.getItem("usuarios") || "[]");
    USUARIOS_PREDEFINIDOS.forEach(predefinido => {
        const existe = usuariosGuardados.some(u => u.email === predefinido.email);
        if (!existe) {
            usuariosGuardados.push(predefinido);
        }
    });
    localStorage.setItem("usuarios", JSON.stringify(usuariosGuardados));
}

/**
 * Intenta iniciar sesión con email y contraseña.
 * @param {string} email
 * @param {string} password
 * @returns {{ ok: boolean, mensaje: string }}
 */
function login(email, password) {
    const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");
    const usuario = usuarios.find(u => u.email === email && u.password === password);
    if (usuario) {
        const sesion = { email: usuario.email, nombre: usuario.nombre, apellido: usuario.apellido };
        sessionStorage.setItem("sesionActiva", JSON.stringify(sesion));
        return { ok: true, mensaje: "Sesión iniciada correctamente." };
    }
    return { ok: false, mensaje: "Email o contraseña incorrectos." };
}

/**
 * Cierra la sesión activa.
 */
function logout() {
    sessionStorage.removeItem("sesionActiva");
    window.location.href = "./index.html";
}

/**
 * Retorna los datos del usuario con sesión activa, o null si no hay sesión.
 * @returns {{ email: string, nombre: string, apellido: string } | null}
 */
function obtenerSesion() {
    const raw = sessionStorage.getItem("sesionActiva");
    return raw ? JSON.parse(raw) : null;
}

/**
 * Actualiza el header dinámicamente según el estado de sesión.
 * - Si hay sesión: muestra "Mi Perfil" + "Cerrar sesión"
 * - Si no hay sesión: muestra "Iniciar sesión" + "Registrarse"
 */
function actualizarHeader() {
    const contenedor = document.querySelector(".header-user");
    if (!contenedor) return;

    const sesion = obtenerSesion();

    if (sesion) {
        contenedor.innerHTML = `
            <div class="header-user-actions">
                <a href="./perfil.html" class="login" id="nav-mi-perfil">
                    <i class="fa-solid fa-circle-user" style="margin-right:0.3em;"></i>Mi Perfil
                </a>
            </div>
            <div class="header-user-actions">
                <a href="#" class="signup" id="nav-cerrar-sesion" onclick="logout(); return false;">Cerrar sesión</a>
            </div>
        `;
    } else {
        contenedor.innerHTML = `
            <div class="header-user-actions">
                <a href="./login.html" class="login" id="nav-iniciar-sesion">Iniciar sesión</a>
            </div>
            <div class="header-user-actions">
                <a href="./registro.html" class="signup" id="nav-registrarse">Registrarse</a>
            </div>
        `;
    }
}

// ─── Inicialización automática ────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
    inicializarUsuarios();
    actualizarHeader();
    actualizarInscripcion();
});
document.addEventListener("click", (event) => {
    if (event.target.id === "nav-cerrar-sesion") {
        logout();
    }
});
function actualizarInscripcion() {
    const contenedor = document.querySelector("#btn-inscribirse");
    if (!contenedor) return;

    const sesion = obtenerSesion();

    if (sesion) {
        contenedor.href = "./formulario.html";
    } else {
        contenedor.href = "./login.html";}}
