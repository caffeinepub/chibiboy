export type ChallengeDay = {
  day: number;
  title: string;
  description: string;
  value: number;
};

export type ChallengeLevel = "easy" | "medium" | "hard";

export const CHALLENGES: Record<ChallengeLevel, ChallengeDay[]> = {
  easy: [
    {
      day: 1,
      title: "Guarda $10 pesos 👇",
      description: "El día de hoy te toca meter $10 pesos a la alcancía.",
      value: 10,
    },
    {
      day: 2,
      title: "Pon una moneda en tu alcancía 👇",
      description:
        "Elige cualquier moneda que tengas y ponla en tu alcancía hoy.",
      value: 5,
    },
    {
      day: 3,
      title: "No compres un dulce hoy 👇",
      description:
        "Resiste el antojo de comprar dulces hoy y guarda ese dinero.",
      value: 5,
    },
    {
      day: 4,
      title: "Guarda todo tu cambio 👇",
      description:
        "Cada moneda de cambio que recibas hoy, guárdala en tu alcancía.",
      value: 10,
    },
    {
      day: 5,
      title: "Ahorra $15 pesos 👇",
      description: "Busca $15 pesos y ponlos en tu alcancía hoy.",
      value: 15,
    },
    {
      day: 6,
      title: "No compres refresco 👇",
      description: "Evita comprar refresco hoy y ahorra ese dinero.",
      value: 15,
    },
    {
      day: 7,
      title: "Ahorra $10 pesos 👇",
      description: "Guarda $10 pesos en tu alcancía hoy.",
      value: 10,
    },
    {
      day: 8,
      title: "Guarda una moneda de $10 y $5 👇",
      description:
        "Busca una moneda de $10 y una de $5 y ponlas en tu alcancía.",
      value: 15,
    },
    {
      day: 9,
      title: "No gastes en snacks 👇",
      description: "Hoy sin snacks. Guarda el dinero que hubiera costado.",
      value: 15,
    },
    {
      day: 10,
      title: "Ahorra el cambio que encuentres 👇",
      description:
        "Busca monedas en tus bolsillos, mochila o casa y guárdalas.",
      value: 10,
    },
    {
      day: 11,
      title: "Pon tu moneda más grande 👇",
      description:
        "Busca la moneda de mayor valor que tengas y métela a la alcancía.",
      value: 20,
    },
    {
      day: 12,
      title: "No gastes nada hoy 👇",
      description: "Pasa el día sin gastar nada y ahorra ese dinero.",
      value: 20,
    },
    {
      day: 13,
      title: "Sin antojos hoy 👇",
      description: "Evita cualquier gasto en antojos y ahorra ese dinero.",
      value: 15,
    },
    {
      day: 14,
      title: "Ahorra $10 pesos 👇",
      description: "Guarda $10 pesos más en tu alcancía.",
      value: 10,
    },
    {
      day: 15,
      title: "Pon otra moneda de $10 👇",
      description: "Busca una moneda de $10 y agrégala a tu alcancía.",
      value: 10,
    },
    {
      day: 16,
      title: "No pidas comida extra 👇",
      description: "Hoy sin pedir comida extra. Guarda ese dinero.",
      value: 20,
    },
    {
      day: 17,
      title: "Ahorra $5 pesos 👇",
      description: "Guarda $5 pesos en tu alcancía hoy.",
      value: 5,
    },
    {
      day: 18,
      title: "Ahorra $15 pesos 👇",
      description: "Meta del día: $15 pesos en tu alcancía.",
      value: 15,
    },
    {
      day: 19,
      title: "Sin golosinas hoy 👇",
      description: "No gastes en golosinas y ahorra ese dinero.",
      value: 15,
    },
    {
      day: 20,
      title: "Guarda todo el cambio del día 👇",
      description: "Todo el cambio que recibas hoy va directo a tu alcancía.",
      value: 20,
    },
    {
      day: 21,
      title: "Ahorra $25 pesos 👇",
      description:
        "¡Reto final del nivel fácil! Guarda $25 pesos en tu alcancía.",
      value: 25,
    },
  ],
  medium: [
    {
      day: 1,
      title: "Ahorra el 5% de lo que recibas 👇",
      description:
        "Del dinero que recibas hoy, aparta el 5% y guárdalo en tu alcancía.",
      value: 20,
    },
    {
      day: 2,
      title: "Sin compras impulsivas 👇",
      description: "No compres nada impulsivo hoy y ahorra ese dinero.",
      value: 20,
    },
    {
      day: 3,
      title: "Lista de gastos innecesarios 👇",
      description:
        "Haz una lista de tus 3 gastos innecesarios y reflexiona sobre ellos.",
      value: 15,
    },
    {
      day: 4,
      title: "Ahorra $20 pesos 👇",
      description: "Guarda $20 pesos en tu alcancía hoy.",
      value: 20,
    },
    {
      day: 5,
      title: "Sin comida fuera 👇",
      description: "No gastes en comida fuera hoy y ahorra ese dinero.",
      value: 30,
    },
    {
      day: 6,
      title: "Pon una moneda de $20 👇",
      description: "Busca una moneda de $20 y ponla en tu alcancía.",
      value: 20,
    },
    {
      day: 7,
      title: "Ahorra el cambio de 2 días 👇",
      description: "Junta el cambio de hoy y de ayer y guárdalos todos.",
      value: 25,
    },
    {
      day: 8,
      title: "Reflexión de gastos 👇",
      description:
        "Anota en qué gastaste los últimos 3 días y encuentra 1 gasto que puedas eliminar.",
      value: 15,
    },
    {
      day: 9,
      title: "Reduce un gasto habitual 👇",
      description: "Identifica un pequeño gasto habitual y redúcelo hoy.",
      value: 20,
    },
    {
      day: 10,
      title: "Ahorra el 8% de lo que te den 👇",
      description: "Del dinero que recibas hoy, aparta el 8% para tu alcancía.",
      value: 25,
    },
    {
      day: 11,
      title: "Sin gastos en apps 👇",
      description:
        "No gastes en apps, juegos ni skins hoy y ahorra ese dinero.",
      value: 25,
    },
    {
      day: 12,
      title: "Guarda 3 monedas de $10 👇",
      description: "Busca 3 monedas de $10 y ponlas en tu alcancía.",
      value: 30,
    },
    {
      day: 13,
      title: "Sin refrescos ni café 👇",
      description: "Evita comprar refrescos o café hoy y ahorra ese dinero.",
      value: 20,
    },
    {
      day: 14,
      title: "Ahorra $25 pesos 👇",
      description: "Guarda $25 pesos en tu alcancía hoy.",
      value: 25,
    },
    {
      day: 15,
      title: 'Elimina un "gasto hormiga" 👇',
      description:
        'Identifica un "gasto hormiga" (pequeño gasto frecuente) y elimínalo hoy.',
      value: 20,
    },
    {
      day: 16,
      title: "Sin antojitos en la escuela 👇",
      description: "No compres antojitos en la escuela o el trabajo hoy.",
      value: 20,
    },
    {
      day: 17,
      title: "Guarda tu cambio más grande 👇",
      description: "El cambio más grande que tengas hoy va a tu alcancía.",
      value: 20,
    },
    {
      day: 18,
      title: "Ahorra el 12% de tu ingreso 👇",
      description:
        "Del dinero que recibas hoy, aparta el 12% para tu alcancía.",
      value: 30,
    },
    {
      day: 19,
      title: "Reduce un gasto fijo hoy 👇",
      description:
        "Reduce un gasto fijo aunque sea solo por hoy y guarda la diferencia.",
      value: 25,
    },
    {
      day: 20,
      title: "Ahorra $35 pesos 👇",
      description: "Guarda $35 pesos en tu alcancía hoy.",
      value: 35,
    },
    {
      day: 21,
      title: "Reflexión final de nivel 👇",
      description:
        "Reto final del nivel medio. Escribe 3 hábitos de ahorro que has formado y guarda $20 como celebración.",
      value: 40,
    },
  ],
  hard: [
    {
      day: 1,
      title: "Ahorra el 15% de tu ingreso 👇",
      description:
        "Del dinero que recibas hoy, aparta el 15% para tu alcancía.",
      value: 40,
    },
    {
      day: 2,
      title: "Sin comida fuera todo el día 👇",
      description: "No gastes en comida fuera en todo el día de hoy.",
      value: 40,
    },
    {
      day: 3,
      title: "Auditoría de gastos 👇",
      description:
        "Revisa todos tus gastos del mes. Identifica 3 que puedas eliminar y ahorra $20.",
      value: 30,
    },
    {
      day: 4,
      title: "Ahorra $50 pesos 👇",
      description: "Guarda $50 pesos en tu alcancía hoy.",
      value: 50,
    },
    {
      day: 5,
      title: "Sin compras impulsivas 👇",
      description:
        "Cero compras impulsivas hoy. Si quieres algo, espera 24 horas antes de comprarlo.",
      value: 40,
    },
    {
      day: 6,
      title: "Guarda 6 monedas de $10 👇",
      description: "Busca 6 monedas de $10 y ponlas en tu alcancía hoy.",
      value: 60,
    },
    {
      day: 7,
      title: "Elimina un gasto de la semana 👇",
      description:
        "Revisa tus gastos de la semana, elimina 1 y guarda ese dinero.",
      value: 35,
    },
    {
      day: 8,
      title: "Sin transporte extra 👇",
      description:
        "Evita gastos en transporte extra (si es posible) y guarda ese dinero.",
      value: 35,
    },
    {
      day: 9,
      title: "Sin apps ni videojuegos 👇",
      description: "No gastes en apps o videojuegos hoy y guarda ese dinero.",
      value: 35,
    },
    {
      day: 10,
      title: "Ahorra el 20% nuevamente 👇",
      description:
        "Del dinero que recibas hoy, aparta el 20% para tu alcancía.",
      value: 50,
    },
    {
      day: 11,
      title: "Reto de inversión mental 👇",
      description:
        "Investiga 1 instrumento de ahorro o inversión y escribe para qué sirve. Guarda $30.",
      value: 30,
    },
    {
      day: 12,
      title: "Ahorra $65 pesos 👇",
      description: "Guarda $65 pesos en tu alcancía hoy.",
      value: 65,
    },
    {
      day: 13,
      title: "Recorta un gasto que no necesitas 👇",
      description: "Identifica un gasto que no necesitas y guarda ese dinero.",
      value: 40,
    },
    {
      day: 14,
      title: "Día de revisión 👇",
      description:
        "Revisa tu avance total hasta ahora. Calcula cuánto has ahorrado y felicítate. Guarda $30.",
      value: 30,
    },
    {
      day: 15,
      title: "Ahorra el 25% o tu máximo 👇",
      description:
        "Del dinero que recibas hoy, aparta el 25% (o lo máximo que puedas) para tu alcancía.",
      value: 60,
    },
    {
      day: 16,
      title: "Cero compras impulsivas 👇",
      description:
        "Ninguna compra impulsiva hoy. Cada vez que sientas el impulso, escríbelo en lugar de comprarlo.",
      value: 50,
    },
    {
      day: 17,
      title: "Guarda tu billete más pequeño 👇",
      description:
        "El billete de menor denominación que tengas va directo a tu alcancía.",
      value: 50,
    },
    {
      day: 18,
      title: "Sin ningún antojo 👇",
      description: "No gastes en ningún antojo hoy y guarda ese dinero.",
      value: 45,
    },
    {
      day: 19,
      title: "Planificación financiera 👇",
      description:
        "Escribe un plan de ahorro para el próximo mes. ¿Cuánto quieres ahorrar? ¿Cómo lo lograrás? Guarda $40.",
      value: 40,
    },
    {
      day: 20,
      title: "Ahorra $100 pesos 👇",
      description:
        "Guarda $100 pesos o lo máximo que puedas en tu alcancía hoy.",
      value: 100,
    },
    {
      day: 21,
      title: "¡Reto final del nivel difícil! 👇",
      description:
        "No gastes en nada NO esencial. Hoy demuestras que eres un campeón del ahorro.",
      value: 100,
    },
  ],
};
