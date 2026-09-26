export async function ajouterJournal(connection, data) {


    const {

        id_utilisateur,
        action,
        table_concernee

    } = data;



    const [result] = await connection.query(

        `
        INSERT INTO journal_activite
        (
            id_utilisateur,
            action,
            table_concernee
        )

        VALUES (?,?,?)

        `,

        [

            id_utilisateur,
            action,
            table_concernee

        ]

    );


    return result;

}