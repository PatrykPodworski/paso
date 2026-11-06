// Listening dialogues, one entry per speaker turn: [speaker, text]. `voices` gives each speaker a
// reference voice of the ai repo's audio/spanish. The turn texts joined with spaces must equal the
// question's audio text, which is the clip's lookup key.
export const dialogues = [
  {
    id: "mock-l1-0",
    voices: { waiter: "male", customer: "female" },
    turns: [
      ["waiter", "Buenos días. ¿Qué quiere tomar?"],
      ["customer", "Quiero un café con leche y una tostada, por favor."],
      ["waiter", "¿Quiere también un zumo de naranja?"],
      ["customer", "No, gracias. Solo el café y la tostada."],
    ],
  },
  {
    id: "mock-l1-1",
    voices: { friend: "female", daniel: "male" },
    turns: [
      ["friend", "¿Cómo vas al trabajo, Daniel?"],
      ["daniel", "Normalmente voy en autobús."],
      ["friend", "¿No tienes coche?"],
      [
        "daniel",
        "Sí, pero no hay aparcamiento cerca de mi oficina. El autobús para justo delante del edificio.",
      ],
    ],
  },
  {
    id: "mock-l1-2",
    voices: { customer: "female", assistant: "male" },
    turns: [
      ["customer", "Buenas tardes. Busco un vestido azul para una fiesta."],
      ["assistant", "Tenemos este en su talla. ¿Le gusta?"],
      ["customer", "Sí, es muy bonito. Me llevo el vestido, pero no necesito zapatos."],
    ],
  },
  {
    id: "mock-l1-3",
    voices: { first: "male", second: "female" },
    turns: [
      ["first", "¿Estudiamos juntos esta tarde?"],
      ["second", "Sí, pero en mi casa hay mucho ruido. Podemos ir a la biblioteca."],
      ["first", "Buena idea. Nos vemos en la biblioteca a las cinco, después de comer."],
    ],
  },
  {
    id: "mock-l1-4",
    voices: { first: "male", second: "female" },
    turns: [
      ["first", "¿Vamos al parque esta mañana?"],
      ["second", "No, hoy llueve mucho y hace frío. Es mejor estar en casa. Mañana hace sol."],
      ["first", "Vale, hoy podemos ver una película y mañana salimos."],
    ],
  },
  {
    id: "mock-l4",
    voices: { friend: "female", pablo: "male" },
    turns: [
      ["friend", "Hola, Pablo. ¿Tienes planes para el sábado?"],
      ["pablo", "Sí, quiero ir a Segovia con mi hermana. ¿Quieres venir?"],
      ["friend", "Me encantaría. ¿Cómo vamos?"],
      [
        "pablo",
        "Podemos ir en tren. El tren sale de Madrid a las nueve de la mañana y llega a las diez.",
      ],
      ["friend", "Muy bien. ¿Cuánto cuesta el billete?"],
      ["pablo", "Cuesta doce euros por persona. Mi hermana compra los billetes esta tarde."],
      ["friend", "Perfecto. ¿Y qué hacemos en Segovia?"],
      [
        "pablo",
        "Primero podemos visitar el centro. Hay una plaza muy bonita y una iglesia antigua. Después comemos en un restaurante cerca de la estación.",
      ],
      ["friend", "¿A qué hora comemos?"],
      ["pablo", "A las dos. El restaurante tiene un menú de quince euros con bebida y postre."],
      ["friend", "Me parece bien. ¿Volvemos por la tarde?"],
      ["pablo", "Sí, el tren de vuelta sale a las seis. Llegamos a Madrid a las siete."],
      ["friend", "Entonces nos vemos el sábado en la estación. ¿A las ocho y media?"],
      [
        "pablo",
        "Sí, a las ocho y media, junto a la entrada principal. No olvides llevar agua. Hace mucho calor.",
      ],
      ["friend", "De acuerdo, hasta el sábado."],
    ],
  },
  {
    id: "u7-a0",
    voices: { asker: "female", local: "male" },
    turns: [
      ["asker", "Perdona, ¿dónde está la estación?"],
      [
        "local",
        "Está cerca. Sigue todo recto y después gira a la derecha. La estación está al lado del supermercado. Son cinco minutos a pie.",
      ],
    ],
  },
  {
    id: "u8-a0",
    voices: { customer: "male", assistant: "female" },
    turns: [
      ["customer", "Buenos días. Busco una camisa azul, talla mediana. ¿Cuánto cuesta?"],
      ["assistant", "Cuesta veintidós euros."],
      ["customer", "Muy bien. Quiero dos, por favor. ¿Puedo pagar con tarjeta?"],
    ],
  },
];
