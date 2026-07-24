import type { AuthStatusResponse, AuthUser } from '../types/bloodPressure';

export async function getAuthStatus(): Promise<AuthStatusResponse> {
  try {
    const res = await fetch('/api/auth/status', { credentials: 'include' });
    if (!res.ok) throw new Error('Error al consultar estado de autenticación');
    return await res.json();
  } catch (err) {
    console.error('Error al obtener estado de auth:', err);
    return { hasAdmin: false, userCount: 0, user: null };
  }
}

export async function setupAdmin(payload: { username: string; name: string; password: string }): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
  try {
    const res = await fetch('/api/auth/setup-admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) return { success: false, error: data.error || 'Error al crear administrador inicial' };
    return { success: true, user: data.user };
  } catch (err) {
    return { success: false, error: 'Error de conexión con el servidor' };
  }
}

export async function login(payload: { username: string; password: string }): Promise<{
  success: boolean;
  requires2FA?: boolean;
  tempToken?: string;
  user?: AuthUser;
  error?: string;
}> {
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) return { success: false, error: data.error || 'Error al iniciar sesión' };

    if (data.requires2FA) {
      return { success: true, requires2FA: true, tempToken: data.tempToken };
    }

    return { success: true, user: data.user };
  } catch (err) {
    return { success: false, error: 'Error de conexión con el servidor' };
  }
}

export async function verifyLoginTotp(payload: { tempToken: string; code: string }): Promise<{
  success: boolean;
  user?: AuthUser;
  error?: string;
}> {
  try {
    const res = await fetch('/api/auth/login/totp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) return { success: false, error: data.error || 'Código 2FA incorrecto' };
    return { success: true, user: data.user };
  } catch (err) {
    return { success: false, error: 'Error de conexión con el servidor' };
  }
}

export async function logout(): Promise<void> {
  try {
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });
  } catch (err) {
    console.error('Error al cerrar sesión:', err);
  }
}

// 2FA Setup & Verification
export async function setupTotp(): Promise<{ secret: string; qrCodeDataUrl: string } | null> {
  try {
    const res = await fetch('/api/auth/totp/setup', {
      method: 'POST',
      credentials: 'include',
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error('Error al solicitar setup 2FA:', err);
    return null;
  }
}

export async function verifyAndEnableTotp(code: string): Promise<{ success: boolean; recoveryCodes?: string[]; error?: string }> {
  try {
    const res = await fetch('/api/auth/totp/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ code }),
    });
    const data = await res.json();
    if (!res.ok) return { success: false, error: data.error || 'Error al verificar 2FA' };
    return { success: true, recoveryCodes: data.recoveryCodes };
  } catch (err) {
    return { success: false, error: 'Error de conexión' };
  }
}

export async function disableTotp(): Promise<boolean> {
  try {
    const res = await fetch('/api/auth/totp/disable', {
      method: 'POST',
      credentials: 'include',
    });
    return res.ok;
  } catch (err) {
    return false;
  }
}

// Administración de usuarios (Solo Admin)
export async function listUsers(): Promise<AuthUser[]> {
  try {
    const res = await fetch('/api/users', { credentials: 'include' });
    if (!res.ok) return [];
    return await res.json();
  } catch (err) {
    return [];
  }
}

export async function createUser(payload: { username: string; name: string; password: string; role: 'admin' | 'user' }): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
  try {
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) return { success: false, error: data.error || 'Error al crear usuario' };
    return { success: true, user: data };
  } catch (err) {
    return { success: false, error: 'Error de conexión' };
  }
}

export async function deleteUser(id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/users/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    return res.ok;
  } catch (err) {
    return false;
  }
}

export async function resetUserPassword(id: string, newPassword: string): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch(`/api/users/${id}/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ newPassword }),
    });
    const data = await res.json();
    if (!res.ok) return { success: false, error: data.error || 'Error al restablecer clave' };
    return { success: true };
  } catch (err) {
    return { success: false, error: 'Error de conexión' };
  }
}
