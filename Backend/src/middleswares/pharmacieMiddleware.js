export function verifierProprietairePharmacie(req, res, next) {

    try {

        const utilisateur = req.utilisateur;


        // Récupération de la pharmacie demandée
        const idPharmacieDemandee = 
            parseInt(req.params.id_pharmacie);



        // Le SUPER_ADMIN a accès à tout
        if (utilisateur.role === "SUPER_ADMIN") {

            return next();

        }



        // Vérification de l'appartenance

        if (
            utilisateur.id_pharmacie !== idPharmacieDemandee
        ) {

            return res.status(403).json({

                message:
                "Vous n'avez pas accès à cette pharmacie"

            });

        }



        next();


    } catch(error) {


        res.status(500).json({

            message:error.message

        });

    }

}