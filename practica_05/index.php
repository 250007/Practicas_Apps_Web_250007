<html lang="en">
    <head>
        <meta name="viewport" content="width-davice-width, initial-scale=1.0"
        <title> primer página web en php - 250007</title>
    </head>
    <body>
        <?php

        //Declaracion de una variable de tipo string
        $nombre = "Jimena Garcia Ramirez";
        $carrera_estudia = "T.S.U. en Desarrollo de >Software Multiplataforma";
        echo "<h1> Hola mundo desde PHP! </h1>";
        #Esta linea imprime la version de PHP que se esta utilizando
        echo "<h2> Estas usando la version de PHP: " .phpversion() ."</h2>";
        ?>
        <!-- Este programa es un comentario en HTML -->
        <hr>
        <?php
        /*Despues de asignarle un valor a la variable $nombre,
        podemos imprimirla en pantalla */
        echo "<h3> Mi nombre es: $nombre y estudio: $carrera_estudia <h3>";
        ?>

        <?php
        $x = 10;
        $y = 5;
        $z = '3a';

        echo "<h3> La suma de $x + $y es: " .($x + $y) . "</h3>";
        echo "<h3> La suma de $x + $y + $z es: " .($x + $y + $z). "</h3>";

        /*Local Scope - Alcance Local*/
        function multiplicar($a, $b)
        {
            $resultado = $a * $b;
            echo"<h4> La multiplicacion de $a * $b es: $resultado </h4>";
            return $resultado;
        }

        echo"<h4> La multiplicacion de 3 x 3 es: " .multiplicar(3, 3) . "</h4>";
        echo"<h4> La multiplicacion de $x x $z es: " .multiplicar($x, $z) . "</h4>";
        echo"<h4> La multiplicacion de 1250 x 325 es: " .multiplicar(1250, 325) . "</h4>";
        echo "<hr>";
        echo"<p> El resultado de la ultima multiplicacion es: $resultado </p>";

        /*Static Scope - Alcance Statico */
        function myTest()
        {
            static $w = 0; //static scope
            echo "$w <br>";
            $w++;
        }

        myTest();
        myTest();
        myTest();
        myTest();
        myTest();
        echo "$w";
        myTest();
        myTest();


        #funcion para saber el tipo de dato de una variable
        
        echo "<h4> La variable <strong>nombre</strong> es de tipo: ";
        var_dump($nombre);
        echo "</p>";

        echo "<h4> La variable <strong>nombre</strong> es de tipo: ";
        var_dump($carrera_estudia);
        echo "</p>";

        $fecha_nacimiento = date("2007/05/14");

        echo "<h4> La variable <strong>nombre</strong> es de tipo: ";
        var_dump($fecha_nacimiento);
        echo "</p>";

        $fecha_hoy = date("2026/11/09");
        $edad_actual = $fecha_hoy - $fecha_nacimiento;
        echo "<p> La edad actual es: $edad_actual </p>";
        ?>

    </body>

</html>