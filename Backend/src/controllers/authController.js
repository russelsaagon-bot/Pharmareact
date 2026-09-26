import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
    trouverUtilisateurParEmail,
    creerUtilisateur,
    creerAdministrateurPharmacie,
    creerClient,
    creerLivreurUtilisateur,
    creerCaissiereUtilisateur,
} from "../Models/authModel.js";


export async function inscription(req, res) {

    try {

        const utilisateurExiste =
            await trouverUtilisateurParEmail(req.body.email);


        if (utilisateurExiste) {

            return res.status(400).json({
                message: "Cet email est déjà utilisé"
            });

        }


        const motDePasseCrypte =
            await bcrypt.hash(req.body.mot_de_passe, 10);



        const nouvelUtilisateur = {

            ...req.body,

            mot_de_passe: motDePasseCrypte

        };


        const resultat =
            await creerUtilisateur(nouvelUtilisateur);



        res.status(201).json({

            message: "Utilisateur créé avec succès",

            id: resultat.insertId

        });


    } catch(error) {


        res.status(500).json({

            message: error.message

        });


    }

}

export async function connexion(req, res) {

    try {

        const { email, mot_de_passe } = req.body;


        const utilisateur =
            await trouverUtilisateurParEmail(email);



        if (!utilisateur) {

            return res.status(404).json({

                message: "Utilisateur introuvable"

            });

        }



        const motDePasseCorrect =
            await bcrypt.compare(
                mot_de_passe,
                utilisateur.mot_de_passe
            );



        if (!motDePasseCorrect) {

            return res.status(401).json({

                message: "Mot de passe incorrect"

            });

        }



        const token = jwt.sign(
            {
                id: utilisateur.id_utilisateur,
                type: "utilisateur",
                role: utilisateur.nom_role,
                id_pharmacie: utilisateur.id_pharmacie
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "24h"
            }
        );



        res.json({

            message: "Connexion réussie",

            token,

            utilisateur: {

                nom: utilisateur.nom,
                role: utilisateur.nom_role

            }

        });



    } catch(error) {

        res.status(500).json({

            message: error.message

        });

    }

}

export async function ajouterAdministrateurPharmacie(req,res){

    try {


        const existe =
        await trouverUtilisateurParEmail(
            req.body.email
        );


        if(existe){

            return res.status(400).json({

                message:"Cet email existe déjà"

            });

        }



        const motDePasseCrypte =
        await bcrypt.hash(
            req.body.mot_de_passe,
            10
        );



        const administrateur = {


            nom:req.body.nom,

            prenom:req.body.prenom,

            email:req.body.email,

            telephone:req.body.telephone,

            mot_de_passe:motDePasseCrypte,

            id_pharmacie:req.body.id_pharmacie


        };



        const resultat =
        await creerAdministrateurPharmacie(
            administrateur
        );



        res.status(201).json({

            message:
            "Administrateur pharmacie créé",

            id:
            resultat.insertId

        });



    }catch(error){


        res.status(500).json({

            message:error.message

        });


    }

}

export async function ajouterLivreurCompte(req, res) {
    try {
        const existe = await trouverUtilisateurParEmail(req.body.email);

        if (existe) {
            return res.status(400).json({ message: "Cet email existe déjà" });
        }

        const motDePasseCrypte = await bcrypt.hash(req.body.mot_de_passe, 10);

        const livreur = {
            nom: req.body.nom,
            prenom: req.body.prenom,
            email: req.body.email,
            telephone: req.body.telephone,
            mot_de_passe: motDePasseCrypte,
            id_pharmacie: req.body.id_pharmacie || req.utilisateur?.id_pharmacie
        };

        const resultat = await creerLivreurUtilisateur(livreur);

        res.status(201).json({
            message: "Compte livreur créé",
            id: resultat.insertId
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function ajouterCaissiereCompte(req, res) {
    try {
        const existe = await trouverUtilisateurParEmail(req.body.email);

        if (existe) {
            return res.status(400).json({ message: "Cet email existe déjà" });
        }

        const motDePasseCrypte = await bcrypt.hash(req.body.mot_de_passe, 10);

        const caissiere = {
            nom: req.body.nom,
            prenom: req.body.prenom,
            email: req.body.email,
            telephone: req.body.telephone,
            mot_de_passe: motDePasseCrypte,
            id_pharmacie: req.body.id_pharmacie || req.utilisateur?.id_pharmacie
        };

        const resultat = await creerCaissiereUtilisateur(caissiere);

        res.status(201).json({
            message: "Compte caissière créé",
            id: resultat.insertId
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function deconnexion(req, res) {
    try {
        res.json({
            message: "Déconnexion réussie"
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function inscriptionClient(req,res){

    try {


        const existe =
        await trouverUtilisateurParEmail(
            req.body.email
        );


        if(existe){

            return res.status(400).json({

                message:"Email déjà utilisé"

            });

        }



        const motDePasseCrypte =
        await bcrypt.hash(
            req.body.mot_de_passe,
            10
        );



        const client = {

            ...req.body,

            mot_de_passe:
            motDePasseCrypte

        };



        const resultat =
        await creerClient(client);



        res.status(201).json({

            message:"Compte client créé",

            id:
            resultat.insertId

        });



    }catch(error){

        res.status(500).json({

            message:error.message

        });

    }

}