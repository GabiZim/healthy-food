export const FOOD_GROUPS: Record<string, string[]> = {
  Obst: [
    'Ananas', 'Apfel', 'Aprikose', 'Avocado', 'Banane', 'Birne', 'Brombeere',
    'Cantaloupe-Melone', 'Clementine', 'Dattel (frisch)', 'Erdbeere', 'Feige',
    'Galia-Melone', 'Granatapfel', 'Grapefruit', 'Heidelbeere', 'Himbeere',
    'Holunderbeere', 'Honigmelone', 'Johannisbeere (rot)', 'Johannisbeere (schwarz)',
    'Johannisbeere (weiss)', 'Kaki', 'Kiwi', 'Kiwi (gelb)', 'Limette', 'Litschi',
    'Mandarine', 'Mango', 'Maracuja', 'Mirabelle', 'Nektarine', 'Orange', 'Papaya',
    'Pfirsich', 'Pflaume', 'Physalis', 'Pomelo', 'Quitte', 'Sauerkirsche',
    'Stachelbeere', 'Suesskirsche', 'Traube rot', 'Traube weiss', 'Wassermelone',
    'Zitrone', 'Zwetschge'
  ],
  Gemuese: [
    'Aubergine', 'Blumenkohl', 'Brokkoli', 'Buschbohne', 'Cherrytomate', 'Chinakohl',
    'Einlegegurke', 'Erbse', 'Fenchel', 'Fruehlingszwiebel', 'Gruenkohl', 'Gurke',
    'Karotte (Moehre)', 'Knoblauch', 'Kohlrabi', 'Kuerbis (Butternut)',
    'Kuerbis (Hokkaido)', 'Lauch (Porree)', 'Mais (frisch)', 'Mangold', 'Paprika',
    'Pastinake', 'Peperoni', 'Petersilienwurzel', 'Pilze', 'Radieschen',
    'Rettich (weiss)', 'Rosenkohl', 'Rote Bete', 'Rotkohl', 'Schalotte',
    'Schwarzwurzel', 'Sellerieknolle', 'Spargel (gruen)', 'Spargel (weiss)',
    'Spinat', 'Spitzkohl', 'Spitzpaprika', 'Stangenbohne', 'Staudensellerie',
    'Steckruebe', 'Tomate', 'Weisskohl', 'Wirsing', 'Zucchini', 'Zwiebel', 'Kartoffel'
  ],
  'TK Gemuese': ['Buschbohnen', 'Rosenkohl', 'Blumenkohl', 'Brokkoli', 'Schwarzwurzeln', 'Suppengemuese'],
  Salat: ['Chicoree', 'Eisbergsalat', 'Endivie', 'Feldsalat', 'Kopfsalat', 'Rucola'],
  Huelsenfruechte: [
    'Ackerbohne', 'Adzukibohne', 'Belugalinse', 'Berglinsen', 'Erbse', 'Kichererbsen',
    'Kidneybohnen', 'Linse (gelb)', 'Linse (rot)', 'Lupine', 'Mungobohne',
    'Saubohnen', 'Schwarze Bohne', 'Sojabohne', 'Straucherbse (Taubenerbse)',
    'Tellerlinse', 'Tofu', 'Weisse Bohne'
  ],
  'Huelsenfruechte Dose': ['Kichererbsen', 'Kidneybohnen', 'Mais', 'Erbsen', 'Dicke Bohnen', 'Weisse Bohnen'],
  Getreide: ['Dinkel', 'Gerste', 'Hafer', 'Hirse', 'Mais', 'Quinoa', 'Reis', 'Roggen', 'Weizen'],
  'Nuesse & Samen': [
    'Cashew', 'Chiasamen', 'Erdnuss', 'Esskastanie (Maronen)', 'Hanfsamen',
    'Haselnuss', 'Kokosnuss', 'Kuerbiskern', 'Leinsamen', 'Macadamianuss',
    'Mandel', 'Mohn', 'Paranuss', 'Pekannuss', 'Pinienkern', 'Pistazie',
    'Sesam', 'Sonnenblumenkern', 'Walnuss'
  ],
  'Kraeuter (frisch)': ['Basilikum', 'Ingwer', 'Knoblauch', 'Petersilie', 'Rosmarin', 'Salbei', 'Schnittlauch'],
  'Kraeuter, Obst (getr.)': ['Basilikum', 'Dill', 'Liebstoeckel', 'Lorbeer', 'Majoran', 'Oregano', 'Aprikose', 'Cranberry'],
  Fisch: ['Fisch'],
  Gewuerze: [
    'Anis', 'Chili', 'Curry', 'Fenchelsamen', 'Ingwer (getrocknet)', 'Kardamom',
    'Koriander (Samen)', 'Kreuzkuemmel', 'Kurkuma', 'Muskatnuss', 'Nelke',
    'Paprikapulver', 'Pfeffer (schwarz)', 'Piment', 'Safran', 'Sternanis', 'Vanille', 'Zimt'
  ]
};

export const FOOD_GROUP_OPTIONS = [...Object.keys(FOOD_GROUPS), 'Eigene'];
