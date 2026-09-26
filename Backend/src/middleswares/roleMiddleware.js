export function autoriserRole(...rolesAutorises) {

    return (req, res, next) => {


        const roleUtilisateur = req.utilisateur.role;


        if (!rolesAutorises.includes(roleUtilisateur)) {

            return res.status(403).json({

                message: "Accès interdit : droits insuffisants"

            });

        }


        next();

    };

}

export function verifierRole(...rolesAutorises) {

    return (req, res, next) => {

        if (!req.utilisateur) {

            return res.status(401).json({

                message: "Utilisateur non authentifié"

            });

        }

        if (!rolesAutorises.includes(req.utilisateur.role)) {

            return res.status(403).json({

                message: "Accès refusé"

            });

        }

        next();

    };

}