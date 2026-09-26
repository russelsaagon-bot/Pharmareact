import {
    getNotificationsUtilisateur,
    getNotificationsNonLues,
    marquerNotificationLue,
    marquerToutesNotificationsLues,
    getNotificationsPharmacie
} from "../Models/notificationModel.js";

export async function listerNotifications(req, res) {
    try {
        const id_utilisateur = req.utilisateur.id_utilisateur || req.utilisateur.id_client;
        const notifications = await getNotificationsUtilisateur(id_utilisateur);

        res.json(notifications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function listerNotificationsNonLues(req, res) {
    try {
        const id_utilisateur = req.utilisateur.id_utilisateur || req.utilisateur.id_client;
        const notifications = await getNotificationsNonLues(id_utilisateur);

        res.json(notifications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function marquerLue(req, res) {
    try {
        const { id } = req.params;
        await marquerNotificationLue(id);

        res.json({ message: "Notification marquée comme lue" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function marquerToutesLues(req, res) {
    try {
        const id_utilisateur = req.utilisateur.id_utilisateur || req.utilisateur.id_client;
        await marquerToutesNotificationsLues(id_utilisateur);

        res.json({ message: "Toutes les notifications marquées comme lues" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function listerNotificationsPharmacie(req, res) {
    try {
        const id_pharmacie = req.utilisateur.id_pharmacie;
        const notifications = await getNotificationsPharmacie(id_pharmacie);

        res.json(notifications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}