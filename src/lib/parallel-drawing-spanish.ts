/** Local game translations: drawing samples and names never leave the device. */
export const parallelDrawingSpanish=String.raw`
Parallel Lines · Draw the Match	Rectas paralelas · Dibuja la pareja
A steady hand. A steady gap.	Un trazo firme. Una distancia constante.
How parallel can you draw?	¿Qué tan paralela puedes dibujarla?
Draw a second line that stays the same perpendicular distance from the first line.	Dibujar una segunda recta que mantenga la misma distancia perpendicular respecto a la primera.
How independently can you draw a second line that stays the same perpendicular distance from the first line?	¿Con cuánta independencia puedes dibujar una segunda recta que mantenga la misma distancia perpendicular respecto a la primera?
Draw your first line. It snaps straight when you lift.	Dibuja tu primera recta. Se endereza cuando levantas el dedo o lápiz.
Draw a second line beside it. Keep the gap even from start to finish.	Dibuja una segunda recta al lado. Mantén la misma distancia de principio a fin.
See your parallel score, reveal the distances, and try to beat your best.	Mira tu puntuación de paralelismo, revela las distancias e intenta superar tu mejor resultado.
Use your finger, Apple Pencil, or mouse. There is no timer.	Usa el dedo, Apple Pencil o ratón. No hay límite de tiempo.
Let’s draw →	Vamos a dibujar →
Names and scores stay on this device. Finish with a reflection and save your own record.	Los nombres y resultados se quedan en este dispositivo. Termina con una reflexión y guarda tu propio registro.
Draw your first line.	Dibuja tu primera recta.
Draw a second line parallel to the blue line.	Dibuja una segunda recta paralela a la azul.
Your parallel match	Tu pareja de rectas
Best	Mejor
Rounds	Rondas
Rounds played	Rondas jugadas
Best match	Mejor resultado
Average match	Resultado promedio
Finish & reflect	Terminar y reflexionar
Your canvas. Your first line.	Tu lienzo. Tu primera recta.
Parallel line drawing canvas	Lienzo para dibujar rectas paralelas
Free drawing canvas. Draw a first line, then a parallel line.	Lienzo de dibujo libre. Dibuja una primera recta y luego una paralela.
Parallel score	Puntuación de paralelismo
Try the same line again	Intentar la misma recta otra vez
Draw a new first line	Dibujar una nueva primera recta
Reveal distances	Mostrar distancias
Hide distances	Ocultar distancias
Draw a long, fairly straight stroke anywhere on the canvas.	Dibuja un trazo largo y bastante recto en cualquier lugar del lienzo.
Draw a long stroke with a visible gap. You can draw in either direction.	Dibuja un trazo largo con una distancia visible. Puedes dibujar en cualquier dirección.
Your red stroke stays visible. Reveal the distances to see where the gap changes.	Tu trazo rojo sigue visible. Muestra las distancias para ver dónde cambia la separación.
The markers meet the blue line at right angles. Parallel lines keep the same gap.	Las marcas llegan a la recta azul en ángulo recto. Las rectas paralelas mantienen la misma distancia.
Make the first line longer. Draw across a good part of the canvas.	Haz la primera recta más larga. Dibuja a lo largo de una buena parte del lienzo.
Try a straighter first stroke. We will straighten it when you lift.	Intenta un primer trazo más recto. Lo enderezaremos cuando levantes el dedo o lápiz.
Make the second line longer so we can compare the gap.	Haz la segunda recta más larga para poder comparar la distancia.
Leave a visible gap. The second line must be separate from the blue line.	Deja una separación visible. La segunda recta debe estar separada de la azul.
Parallel perfection. Those lines are keeping their distance!	¡Paralelismo perfecto! ¡Esas rectas mantienen la distancia!
Beautifully matched. Same direction, steady gap!	¡Muy bien alineadas! ¡Misma dirección y distancia constante!
Close! Keep that gap steady all the way across.	¡Casi! Mantén la misma distancia durante todo el trazo.
Getting there. Watch where the gap starts to change.	Vas mejorando. Observa dónde empieza a cambiar la distancia.
Try again. Match the direction and keep an even gap.	Inténtalo otra vez. Iguala la dirección y mantén una distancia constante.
100% means a perfectly steady gap and matching direction. This is a game score, not a formal mathematics grade.	100% significa una distancia constante y la misma dirección. Esta es una puntuación del juego, no una calificación formal de matemáticas.
This is a drawing-game score, not a formal mathematics grade.	Esta es una puntuación del juego de dibujo, no una calificación formal de matemáticas.
A higher score means the second stroke kept a steadier perpendicular distance and direction.	Una puntuación más alta significa que el segundo trazo mantuvo una distancia perpendicular y una dirección más constantes.
`
export function parallelDrawingTemplate(text:string){const match=text.match(/^Round (\d+): (\d+)% parallel$/);return match?`Ronda ${match[1]}: ${match[2]}% de paralelismo`:undefined}
