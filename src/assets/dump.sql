
CREATE TABLE
IF NOT EXISTS structures
(id INTEGER PRIMARY KEY AUTOINCREMENT,nom TEXT,email TEXT,tel TEXT,address1 TEXT,address2 TEXT,nature TEXT,estactive INTEGER);

CREATE TABLE
IF NOT EXISTS users
(id INTEGER PRIMARY KEY AUTOINCREMENT,pseudo TEXT,email TEXT,tel TEXT,pin TEXT,etat INTEGER,estadmin INTEGER);

CREATE TABLE
IF NOT EXISTS abonnes
(id INTEGER PRIMARY KEY AUTOINCREMENT,nom TEXT,email TEXT,tel TEXT,address TEXT,tarif INTEGER,etat INTEGER);

CREATE TABLE
IF NOT EXISTS categories
(id INTEGER PRIMARY KEY AUTOINCREMENT,nom TEXT,tarif INTEGER,color TEXT,nature TEXT,frequence TEXT,etat INTEGER);


CREATE TABLE
IF NOT EXISTS recettes
(id INTEGER PRIMARY KEY AUTOINCREMENT,ordre INTEGER,datec DATE,prix REAL,ref TEXT,tel TEXT,payer BOOLEAN,effecter BOOLEAN,categorie INTEGER,abonne INTEGER,facid INTEGER,etat INTEGER,userid INTEGER);

CREATE TABLE
IF NOT EXISTS depenses
(id INTEGER PRIMARY KEY AUTOINCREMENT,datec DATE,prix REAL,ref TEXT,payer BOOLEAN,categorie INTEGER,facid INTEGER,etat INTEGER,userid INTEGER);

CREATE TABLE
IF NOT EXISTS factures
(id INTEGER PRIMARY KEY AUTOINCREMENT,datec DATE,dated DATE,datef DATE,montant REAL,ref TEXT,payer BOOLEAN,abonne INTEGER,etat INTEGER,userid INTEGER);


INSERT or
IGNORE INTO structures
VALUES
	(1, 'Smart Caisse', 'smartcaisseapp@gmail.com', '',  '', '','C',0);

INSERT or
IGNORE INTO users
VALUES
	(1, 'admin', '', '+00000000000', '0000', 1, 1);

INSERT or
IGNORE INTO abonnes
VALUES
	(1, 'Orange Mali', 'smartcaisse@gmail.com', '+22390000000', 'Aci 2000', 4000, 1),
	(2, 'Malitel', 'smartcaisse@gmail.com', '+22390000000', 'Aci 2000', 2000, 1),
	(3, 'BICC', 'smartcaisse@gmail.com', '+22390000000', 'Aci 2000', 2000, 1);

INSERT or
IGNORE INTO categories
VALUES
	(1, 'Citadine, Compacte', 1000, '#ea989d', 'R', '', 1),
	(2, 'Berline, Break', 2000, '#b9d7f7', 'R', '', 1),
	(3, '4×4, Monospace, Utilitaire', 3000, '#bee8bb', 'R', '', 1),
	(4, 'Tapis, moquêtte', 3000, '#f9f2c0', 'R', '', 1),
	(5, 'Eau, électicité', 0, '#c6bcdd', 'D', 'R', 1),
	(6, 'Savon, omo, Shampoing', 0, '#ffb554', 'D', 'P', 1);

