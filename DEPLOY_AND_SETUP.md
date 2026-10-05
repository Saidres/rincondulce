# Guía de Configuración de Supabase y Despliegue Gratuito

Esta guía explica paso a paso cómo configurar la base de datos de **Supabase** y cómo desplegar la página web de **Rincón Dulce** gratis en **Netlify**, **Vercel** o **Cloudflare Pages**.

---

## Parte 1: Configurar Supabase (Base de Datos, Auth y Almacenamiento)

Supabase es una plataforma gratuita de Postgres con autenticación y almacenamiento de imágenes.

### Paso 1.1: Crear Proyecto en Supabase
1. Ingresa a [https://supabase.com](https://supabase.com) e inicia sesión (puedes entrar con GitHub o Google).
2. Haz clic en **"New Project"**.
3. Ingresa los datos:
   - **Name:** `rincon-dulce`
   - **Database Password:** Elige una contraseña segura y guárdala.
   - **Region:** Selecciona `South America (São Paulo)` o `US East` para menor latencia desde Colombia.
4. Haz clic en **"Create new project"** y espera 1 minuto a que se aprovisione.

### Paso 1.2: Ejecutar el Esquema SQL y Datos Semilla
1. En el menú lateral izquierdo de tu proyecto Supabase, haz clic en **"SQL Editor"** (icono de terminal `>_`).
2. Abre el archivo local del proyecto: [`supabase/schema.sql`](file:///c:/Users/PC/Desktop/Job/Rincondulce/supabase/schema.sql).
3. Copia todo su contenido y pégalo en el editor de SQL de Supabase.
4. Haz clic en el botón verde **"Run"** (o presiona `Ctrl + Enter`).
5. Verás el mensaje `Success. No rows returned`. ¡Listo! Las tablas `categories`, `products`, `toppings` y `business_settings` ya están creadas, con las políticas de seguridad (RLS), el bucket de fotos de productos y el menú inicial cargado.

### Paso 1.3: Crear el Usuario Administrador (Dueños)
1. En el menú lateral izquierdo de Supabase, ve a **"Authentication"** > **"Users"**.
2. Haz clic en **"Add User"** > **"Create User"**.
3. Ingresa el correo de los dueños (ejemplo: `rincondulcepasto@gmail.com`) y una contraseña segura.
4. Marca la casilla **"Auto Confirm User?"** para que no requiera verificación de correo.
5. Haz clic en **"Create user"**. Con este correo y contraseña podrán entrar a `/admin`.

### Paso 1.4: Obtener las Claves de API
1. En Supabase, ve a **"Project Settings"** (icono de engranaje) > **"API"**.
2. Copia los siguientes dos valores:
   - **Project URL:** (ejemplo: `https://xyzcompany.supabase.co`)
   - **anon / public key:** (un token largo que empieza por `eyJ...`)
3. En tu proyecto local, abre el archivo `.env.local` y pega los valores:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-aqui
   ```

---

## Parte 2: Despliegue Gratuito

### Opción A: Desplegar en Vercel (Recomendado para Next.js)
1. Sube tu código a un repositorio de GitHub (o crea un repo en [github.com/new](https://github.com/new)):
   ```bash
   git init
   git add .
   git commit -m "Web Rincón Dulce con Next.js y Supabase"
   git branch -M main
   git remote add origin https://github.com/tu-usuario/rincon-dulce.git
   git push -u origin main
   ```
2. Entra a [https://vercel.com](https://vercel.com) e inicia sesión con GitHub.
3. Haz clic en **"Add New..."** > **"Project"**.
4. Selecciona el repositorio `rincon-dulce`.
5. En la sección **"Environment Variables"**, agrega las 2 variables de Supabase:
   - `NEXT_PUBLIC_SUPABASE_URL` = (tu URL de Supabase)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = (tu anon key de Supabase)
6. Haz clic en **"Deploy"**. En 1 minuto tendrás un enlace público como `https://rincon-dulce.vercel.app` listo para poner en el perfil de Instagram.

### Opción B: Desplegar en Netlify
1. Entra a [https://netlify.com](https://netlify.com) e inicia sesión.
2. Haz clic en **"Add new site"** > **"Import an existing project"** > **GitHub**.
3. Selecciona tu repositorio.
4. Netlify detectará automáticamente Next.js.
5. En **"Environment variables"**, agrega `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
6. Haz clic en **"Deploy rincon-dulce"**.

---

## Parte 3: Conectar tu Dominio Personalizado (Opcional)
Si compran un dominio propio (por ejemplo `rincondulcepasto.com`):
1. En Vercel o Netlify, ve a **Settings** > **Domains**.
2. Escribe el dominio y sigue las instrucciones para apuntar los DNS (normalmente un registro CNAME o Nameservers).
