<article>
    <h1>Aplicación Exercice With Me</h1>
    <h3>versión 0.1.1.1</h3>
    <h2 id="indice">Indice</h2>
    <ol>
        <li><a href="#indice">Indice</a></li>
        <li><a href="#instalacion">Instalación</a></li>
        <ol>
            <li style="text-indent:10px;"><a href="#one">Instalación en dispositivo Método 1</a></li>
            <li style="text-indent:10px;"><a href="#two">Instalación en dispositivo Método 2</a></li>
            <ol>
                <li style="text-indent:20px;"><a href="#a">Instala Ionic v 3.9.2</a></li>
                <li style="text-indent:20px;"><a href="#b">Descarga desde Github</a></li>
                <li style="text-indent:20px;"><a href="#c">Ingresa a carpeta Exercice With Me</a></li>
                <li style="text-indent:20px;"><a href="#d">Descarga componentes con NPM</a></li>
                <li style="text-indent:20px;"><a href="#e">Instala plataforma Android</a></li>
                <li style="text-indent:20px;"><a href="#f">Prepara el entorno Android</a></li>
                <li style="text-indent:20px;"><a href="#g">Instala la aplicación en el dispositivo</a></li>
            </ol>
        </ol>
        <li><a href="#three">Modo de empleo</a></li>
            <ol>
                <li style="text-indent:20px;"><a href="#h">Uso y Ejercicios</a></li>
                <li style="text-indent:20px;"><a href="#i">Google Fit</a></li>
                <li style="text-indent:20px;"><a href="#j">Recuperar Password</a></li>
            </ol>
    </ol>
    <h2>Release Notes</h2>
    <p>Revise el siguiente link. <a href="https://github.com/GonzaloUNAB2018/exercice_with_me/tree/master/APK/release_notes.md">A Release Notes</a></p>
    <h2 id="instalacion">Descarga e instalacion</h2>
    <h3>"Instalation Notes"</h3>
    <p>La aplicación está construida desde el entorno de 
        Ionic en su versión 3.9.2 la que permite crear
        una aplicación web uniendo las capacidades nativas 
        que nos ofrecen los smartphones.</p>
    <p>Para ejecutar la aplicación existen 2 métodos:</p>
    <h3 id="one">Método 1: Instalación desde APK</h3>
    <ol>
        <li><p>En la carpeta <a href="https://github.com/GonzaloUNAB2018/exercice_with_me/tree/master/APK">apk</a> 
            de github se cargan constantemente todas
            las actualizaciones importantes que se realizan a la aplicación.
            Solo debe descargarlas a un dispositivo <b>Android</b> versión 6.0 o 
            superior y ejecutarlo.</p></li>
        <li><p>Ingrese a la aplicación, presionando sobre la versión existente en la carpeta</p></li>
        <img src="https://github.com/GonzaloUNAB2018/exercice_with_me/blob/master/APK/images/img_01.jpeg?raw=true" width="200px">
        <li><p>Presione "Download"</p></li>
        <img src="https://github.com/GonzaloUNAB2018/exercice_with_me/blob/master/APK/images/img_02.jpeg?raw=true" width="200px">
        <li><p>Espere la descarga e inicie la instalación presionando "abrir"</p></li>
        <img src="https://github.com/GonzaloUNAB2018/exercice_with_me/blob/master/APK/images/img_03.jpeg?raw=true" width="200px">
        <li><p>Instale la aplicación (Otorgue permisos desde fuentes desconocidas si el dispositivo lo solicita)</p></li>
        <img src="https://github.com/GonzaloUNAB2018/exercice_with_me/blob/master/APK/images/img_04.jpeg?raw=true" width="200px">
        <li><p>El dispositivo instalará la aplicación</p></li>
        <img src="https://github.com/GonzaloUNAB2018/exercice_with_me/blob/master/APK/images/img_05.jpeg?raw=true" width="200px">
        <li><p>Una vez instalado, presione "abrir"</p></li>
        <img src="https://github.com/GonzaloUNAB2018/exercice_with_me/blob/master/APK/images/img_06.jpeg?raw=true" width="200px">
        <li><p>Se abrirá la aplicación</p></li>
        <img src="https://github.com/GonzaloUNAB2018/exercice_with_me/blob/master/APK/images/img_07.jpeg?raw=true" width="200px">
    </ol>
    <br>
    <h3 id="two">Método 2: Descarga del código y ejecución con entorno de desarrollador</h3>
    <p>Éste método es mas complejo ya que es principalmente para quienes puedan ejecutar usando
        un entorno de desarrollo.
    </p>
    <p>Las herramientas necesarias son las siguientes:
    </p>
    <ol>
        <li><a href="https://developer.android.com/studio">Android Studio</a></li>
        <li><a href="https://git-scm.com/downloads">Git</a></li>
        <li><a href="https://nodejs.org/download/release/v8.16.1/node-v8.16.1-x64.msi">Node v8</a></li>
    </ol>
    <p>Una vez estén todas las aplicaciones instaladas, ejecutamos una aplicación de consola
        (yo uso Powershell) desde una carpeta a la que se destine el proyecto, por ejemplo
        "C:\Proyectos", desde donse se ejecuta los siguiente:
    </p>
    <h4 id="a">Instala Ionic v 3.9.2</h4>
    <code>npm install -g ionic@3.9.2 cordova@7.1.0</code>
    <h4 id="b">Descarga desde Github</h4>
    <code>git clone https://github.com/GonzaloUNAB2018/exercice_with_me</code>
    <h4 id="c">Ingresa a carpeta WalkWithMe</h4>
    <code>cd WalkWithMe</code>
    <h4 id="d">Descarga componentes con NPM</h4>
    <code>npm -i</code>
    <h4 id="e">Instala plataforma Android</h4>
    <code>ionic cordova platform add android@7</code>
    <h4 id="f">Prepara el entorno Android</h4>
    <code>ionic cordova prepare android</code>
    <p>En éste punto ya debes tener tu smartphone conectado al pc
        con los permisos de traspaso de datos correspondientes.
    </p>
    <h4 id="g">Instala la aplicación en el dispositivo</h4>
    <code>ionic cordova run android</code>
    <h3 id="three">Modo de empleo</h3>
    <h4 id="h">Uso y Ejercicios</h4>
    <p>Pantalla de inicio donde se observa "Inicio de Sesión", "Registro" y "Recuperación de contraseña"</p>
    <img src="https://github.com/GonzaloUNAB2018/exercice_with_me/blob/master/APK/Instructions_images/image_001.jpeg?raw=true" width="200px">
    <p>Registro con todos los datos</p>
    <img src="https://github.com/GonzaloUNAB2018/exercice_with_me/blob/master/APK/Instructions_images/image_002.jpeg?raw=true" width="200px">
    <p>Inicie sesión</p>
    <img src="https://github.com/GonzaloUNAB2018/exercice_with_me/blob/master/APK/Instructions_images/image_003.jpeg?raw=true" width="200px">
    <p>Si es la primera vez que inicia le dará conexión al README del repositorio en GitHub</p>
    <img src="https://github.com/GonzaloUNAB2018/exercice_with_me/blob/master/APK/Instructions_images/image_004.jpeg?raw=true" width="200px">
    <p>Si no ha conectado con Google Fit antes, solicitará conectar. Si la rechaza, podrá volver a solicitar mas adelante desde configuración (Dicha conexión servirá para obtener mediciones de pulsaciones cardiacas en caso de contar con un Smartband sincronizado a Google Fit)</p>
    <img src="https://github.com/GonzaloUNAB2018/exercice_with_me/blob/master/APK/Instructions_images/image_005.jpeg?raw=true" width="200px">
    <p>Iniciada la aplicación, puede ejecutar cualquiera de los 3 ejercicios en la página principal</p>
    <img src="https://github.com/GonzaloUNAB2018/exercice_with_me/blob/master/APK/Instructions_images/image_010.jpeg?raw=true" width="200px">
    <p>En cualquiera de los 3 ejercicios, se iniciará una cuenta regresiva <b>de 5 segundos</b> antes de iniciar</p>
    <img src="https://github.com/GonzaloUNAB2018/exercice_with_me/blob/master/APK/Instructions_images/image_006.jpeg?raw=true" width="200px">
    <p>Ejercicios Abdominales registrará datos de Giroscopio y Acelerómetro (X, Y y Z de cada uno)</p>
    <img src="https://github.com/GonzaloUNAB2018/exercice_with_me/blob/master/APK/Instructions_images/image_007.jpeg?raw=true" width="200px">
    <p>Ejercicios Saltos registrará datos de Acelerómetro (X, Y y Z)</p>
    <img src="https://github.com/GonzaloUNAB2018/exercice_with_me/blob/master/APK/Instructions_images/image_008.jpeg?raw=true" width="200px">
    <p>Ejercicios Caminata registrará datos de GPS (Latitud, Longitud, Velocidad) y Pasos ejecutados en la actividad</p>
    <img src="https://github.com/GonzaloUNAB2018/exercice_with_me/blob/master/APK/Instructions_images/image_009.jpeg?raw=true" width="200px">
    <p>Una vez terminado cada ejercicio volverá a la página principal y puede sincronizar en la base de datos, presionando el ícono de la Nube con flecha hacia arriba</p>
    <img src="https://github.com/GonzaloUNAB2018/exercice_with_me/blob/master/APK/Instructions_images/image_010.jpeg?raw=true" width="200px">
    <p>Para subir la información presiones <b>SINCRONIZAR</b></p>
    <img src="https://github.com/GonzaloUNAB2018/exercice_with_me/blob/master/APK/Instructions_images/image_011.jpeg?raw=true" width="200px">
    <p>Espere hasta que las cargas de datos terminen. Una vez finalizado volverá a la pantalla inicial</p>
    <img src="https://github.com/GonzaloUNAB2018/exercice_with_me/blob/master/APK/Instructions_images/image_012.jpeg?raw=true" width="200px">
    <h4 id="i">Google Fit y Pulsos Cardiacos</h4>
    <p>Si cuenta con un registro en Google Fit que tenga registrados pulsaciones cardiacas, puede rescatar la información desde el ícono Corazón</p>
    <img src="https://github.com/GonzaloUNAB2018/exercice_with_me/blob/master/APK/Instructions_images/image_010.jpeg?raw=true" width="200px">
    <p>Primero indique a la aplicación que necesita las pulsaciones, presione <b>OBTENER PULSACIONES</b></p>
    <img src="https://github.com/GonzaloUNAB2018/exercice_with_me/blob/master/APK/Instructions_images/image_013.jpeg?raw=true" width="200px">
    <p>De no contar con registros la aplicación indicará <b>Sin registros pendientes</b> y guardará en la base de datos la fecha y hora del último registro. Así, no solicitar nuevamente el mismo registro</p>
    <img src="https://github.com/GonzaloUNAB2018/exercice_with_me/blob/master/APK/Instructions_images/image_014.jpeg?raw=true" width="200px">
    <h4 id="j">Recuperar Password</h4>
    <p>En página inicial, presiones donde dice <b>¿Olvidó su contraseña?</b>, ingrese el email registrado, revise su correo y siga las instrucciones para cambiar la contraseña</p>
    <img src="https://github.com/GonzaloUNAB2018/exercice_with_me/blob/master/APK/Instructions_images/image_015.jpeg?raw=true" width="200px">
</article>