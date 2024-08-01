
# Pickeeper

Una aplicación para guardar tus imágenes favoritas de manera fácil y segura. Al ingresar tu correo electrónico, la aplicación te enviará un enlace que te permitirá acceder a tu propio baúl de imágenes. 


## Reconocimiento a:

 - [Supabase](https://www.supabase.com)
 - [Awesome README](https://github.com/matiassingers/awesome-readme)



## Resumen de la construcción de Pickeeper

La aplicación está construida con React para el lado del cliente y utiliza Supabase para cubrir las necesidades de base de datos y backend. Para asegurarnos de que los usuarios que utilizan esta aplicación sean los propietarios reales de las imágenes, implementamos un sistema de autenticación mediante Magic Link. Este sistema solicita un correo electrónico y envía un enlace para acceder a la aplicación. Al hacerlo, se genera un UID que te identifica en el almacenamiento de imágenes de Supabase. De esta manera, todas las imágenes que subas o elimines se registran en tu almacenamiento personal y no entran en conflicto con las de otros usuarios. 

Utilicé Supabase porque es una herramienta práctica que proporciona un sistema de almacenamiento de datos rápido y facilita la generación de endpoints necesarios para tu aplicación. Esto permite enfocarse más en el desarrollo del lado del cliente.


## Autor

- [@Belén(Mika0507)](https://github.com/Mika0507)


## Instalación

Instala pickeeper2 con pnpm

```bash
  pnpm install 
```

Arranca la app con:

```bash
pnpm start
```

## Problemas

A la hora de desarrollar la aplicación el primer problema con el que me encontré fué el límite de peticiones que le puedes hacer a Supabase. Si excedes ese límite te lanza un error 429 y tienes que esperar un tiempo a que te de acceso de nuevo. Haciendo algunas modificaciones en el código conseguí obtener el link via email de Supabase sin generar el error pero tienes un límite de veces que puedes ingresar.  
    
## 🔗 Links
[Figma](https://www.figma.com/design/5kLdijstFw48B9UMGd5iUT/P%C3%A1gina-im%C3%A1genes-favoritas?node-id=1-2&t=o5tykypEjSHgKCDa-0)

[Pickeeper](https://image-storage-pi.vercel.app/)


