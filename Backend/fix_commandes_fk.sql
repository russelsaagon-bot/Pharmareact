ALTER TABLE commandes DROP FOREIGN KEY commandes_ibfk_1;
ALTER TABLE commandes MODIFY COLUMN id_client INT NULL;
ALTER TABLE commandes ADD CONSTRAINT commandes_ibfk_1 FOREIGN KEY (id_client) REFERENCES utilisateurs(id_utilisateur) ON DELETE CASCADE;
