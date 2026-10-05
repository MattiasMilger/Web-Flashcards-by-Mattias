/**
 * premade.js - Built-in starter decks
 * Each deck is stored as compact text ("word|translation", one per line,
 * lines starting with # are category headers) and turned into a real deck on demand.
 * Front = target language, back = English.
 */

const Premade = (() => {

    const DECKS = [
        // ------------------------------------------------------------------
        {
            id: 'spanish', language: 'Spanish', flag: 'ES', level: 'Basic → Intermediate',
            blurb: 'The default deck: 200 essential words and phrases, with articles on nouns.',
            text: `
# Greetings & essentials
Hola|Hello
Adiós|Goodbye
Buenos días|Good morning
Buenas tardes|Good afternoon
Buenas noches|Good evening / Good night
Hasta luego|See you later
Hasta mañana|See you tomorrow
Por favor|Please
Gracias|Thank you
De nada|You're welcome
Perdón|Sorry / Excuse me
Lo siento|I am sorry
Sí|Yes
No|No
Mucho gusto|Nice to meet you
¿Cómo estás?|How are you?
Me llamo...|My name is...
No entiendo|I don't understand
¿Puedes repetir?|Can you repeat?
Más despacio, por favor|Slower, please
# Question words
¿Qué?|What?
¿Quién?|Who?
¿Dónde?|Where?
¿Cuándo?|When?
¿Por qué?|Why?
¿Cómo?|How?
¿Cuánto?|How much?
¿Cuál?|Which?
# Numbers
uno|one
dos|two
tres|three
cuatro|four
cinco|five
seis|six
siete|seven
ocho|eight
nueve|nine
diez|ten
cien|one hundred
# Time
el día|the day
la semana|the week
el mes|the month
el año|the year
hoy|today
mañana|tomorrow
ayer|yesterday
ahora|now
después|after / later
antes|before
siempre|always
nunca|never
a veces|sometimes
# People & family
el hombre|the man
la mujer|the woman
el niño / la niña|the boy / the girl
el amigo / la amiga|the friend
la familia|the family
la madre|the mother
el padre|the father
el hermano|the brother
la hermana|the sister
# Food & drink
la comida|the food
el agua|the water
el pan|the bread
la leche|the milk
el café|the coffee
el té|the tea
el vino|the wine
la cerveza|the beer
la carne|the meat
el pollo|the chicken
el pescado|the fish
el huevo|the egg
el arroz|the rice
la fruta|the fruit
el queso|the cheese
la cuenta|the bill
tengo hambre|I am hungry
tengo sed|I am thirsty
# Home & objects
la casa|the house
la habitación|the room
la cocina|the kitchen
la puerta|the door
la ventana|the window
la mesa|the table
la cama|the bed
el libro|the book
el dinero|the money
# Places & travel
la ciudad|the city
la calle|the street
la tienda|the shop
el restaurante|the restaurant
el aeropuerto|the airport
la estación|the station
el tren|the train
el autobús|the bus
el coche|the car
el billete|the ticket
el baño|the bathroom
a la derecha|to the right
a la izquierda|to the left
todo recto|straight ahead
cerca|near
lejos|far
# Common verbs
ser|to be (permanent)
estar|to be (state / location)
tener|to have
hacer|to do / to make
ir|to go
venir|to come
ver|to see
decir|to say
dar|to give
saber|to know (a fact)
conocer|to know (a person / place)
querer|to want / to love
poder|to be able to
comer|to eat
beber|to drink
hablar|to speak
vivir|to live
trabajar|to work
estudiar|to study
comprar|to buy
necesitar|to need
ayudar|to help
llamar|to call
llegar|to arrive
pensar|to think
encontrar|to find
dormir|to sleep
leer|to read
escribir|to write
escuchar|to listen
mirar|to look at
# Adjectives
grande|big
pequeño|small
bueno|good
malo|bad
nuevo|new
viejo|old
bonito|pretty
caro|expensive
barato|cheap
fácil|easy
difícil|difficult
rápido|fast
caliente|hot
frío|cold
feliz|happy
triste|sad
cansado|tired
enfermo|sick
# Colors
rojo|red
azul|blue
verde|green
negro|black
blanco|white
# Body & health
la cabeza|the head
la mano|the hand
el médico|the doctor
# Weather & nature
el viento|the wind
el mar|the sea
# Connectors & small words
y|and
o|or
pero|but
porque|because
con|with
sin|without
para|for / in order to
muy|very
más|more
menos|less
también|also
ya|already
aquí|here
allí|there
algo|something
nada|nothing
todo|everything
mucho|a lot
poco|a little
# Intermediate expressions
tener que|to have to
acabar de|to have just (done)
hay|there is / there are
echar de menos|to miss (someone)
darse cuenta de|to realize
a menudo|often
de repente|suddenly
sin embargo|however
por ejemplo|for example
en cambio|on the other hand
por supuesto|of course
tal vez|maybe
me gusta|I like it
me encantaría|I would love to
¿Cuánto cuesta?|How much does it cost?
¿Dónde está...?|Where is...?
No pasa nada|It's no problem
Estoy de acuerdo|I agree
`
        },
        // ------------------------------------------------------------------
        {
            id: 'french', language: 'French', flag: 'FR', level: 'Basic → Intermediate',
            blurb: 'Core greetings, numbers, food, travel and everyday verbs.',
            text: `
Bonjour|Hello / Good day
Bonsoir|Good evening
Salut|Hi / Bye
Au revoir|Goodbye
À bientôt|See you soon
S'il vous plaît|Please
Merci|Thank you
De rien|You're welcome
Excusez-moi|Excuse me
Pardon|Sorry
Oui|Yes
Non|No
Comment allez-vous ?|How are you? (formal)
Je m'appelle...|My name is...
Je ne comprends pas|I don't understand
Parlez-vous anglais ?|Do you speak English?
un|one
deux|two
trois|three
quatre|four
cinq|five
six|six
sept|seven
huit|eight
neuf|nine
dix|ten
cent|one hundred
le jour|the day
la semaine|the week
aujourd'hui|today
demain|tomorrow
hier|yesterday
maintenant|now
toujours|always
jamais|never
la famille|the family
la mère|the mother
le père|the father
l'ami / l'amie|the friend
l'homme|the man
la femme|the woman
l'eau|the water
le pain|the bread
le fromage|the cheese
le vin|the wine
le café|the coffee
la viande|the meat
le poulet|the chicken
la pomme|the apple
l'addition|the bill
la maison|the house
la porte|the door
la table|the table
le livre|the book
la clé|the key
l'argent|the money
la ville|the city
la rue|the street
la gare|the train station
l'aéroport|the airport
le billet|the ticket
la voiture|the car
être|to be
avoir|to have
aller|to go
faire|to do / to make
vouloir|to want
pouvoir|to be able to
savoir|to know
voir|to see
manger|to eat
boire|to drink
parler|to speak
habiter|to live (reside)
grand|big
petit|small
bon|good
mauvais|bad
beau|beautiful
chaud|hot
froid|cold
Où est... ?|Where is...?
Combien ça coûte ?|How much does it cost?
Je voudrais...|I would like...
J'ai faim|I am hungry
# More vocabulary
Enchanté|Nice to meet you
Pouvez-vous répéter ?|Can you repeat that?
Plus lentement, s'il vous plaît|Slower, please
Je ne sais pas|I don't know
Bien sûr|Of course
Au secours !|Help!
Quoi ?|What?
Qui ?|Who?
Pourquoi ?|Why?
Quand ?|When?
Comment ?|How?
Lequel ?|Which?
vingt|twenty
cinquante|fifty
mille|one thousand
le mois|the month
l'année|the year
le matin|the morning
le soir|the evening
la nuit|the night
l'heure|the hour
plus tard|later
parfois|sometimes
l'enfant|the child
le frère|the brother
la sœur|the sister
le fils|the son
la fille|the daughter
le mari|the husband
l'épouse|the wife
le lait|the milk
l'œuf|the egg
le riz|the rice
la soupe|the soup
le fruit|the fruit
le sucre|the sugar
le sel|the salt
le poisson|the fish
le petit-déjeuner|breakfast
le dîner|dinner
la salade|the salad
la chambre|the room
la cuisine|the kitchen
la fenêtre|the window
la chaise|the chair
le lit|the bed
le téléphone|the phone
le sac|the bag
les toilettes|the toilet
le magasin|the shop
le supermarché|the supermarket
le restaurant|the restaurant
l'hôtel|the hotel
le train|the train
le bus|the bus
la plage|the beach
à droite|to the right
à gauche|to the left
tout droit|straight ahead
près|near
loin|far
venir|to come
dire|to say
donner|to give
prendre|to take
travailler|to work
étudier|to study
acheter|to buy
avoir besoin de|to need
aider|to help
appeler|to call
arriver|to arrive
penser|to think
trouver|to find
dormir|to sleep
lire|to read
écrire|to write
écouter|to listen
attendre|to wait
payer|to pay
ouvrir|to open
fermer|to close
commencer|to begin
finir|to finish
se souvenir|to remember
oublier|to forget
aimer|to love / to like
apprendre|to learn
partir|to leave
demander|to ask
comprendre|to understand
nouveau|new
vieux|old
cher|expensive
bon marché|cheap
facile|easy
difficile|difficult
rapide|fast
lent|slow
heureux|happy
triste|sad
fatigué|tired
malade|sick
plein|full
vide|empty
rouge|red
bleu|blue
vert|green
jaune|yellow
noir|black
blanc|white
la tête|the head
la main|the hand
l'œil|the eye
le cœur|the heart
`
        },
        // ------------------------------------------------------------------
        {
            id: 'german', language: 'German', flag: 'DE', level: 'Basic → Intermediate',
            blurb: 'Essential vocabulary with genders (der / die / das) on nouns.',
            text: `
Hallo|Hello
Guten Morgen|Good morning
Guten Tag|Good day
Guten Abend|Good evening
Gute Nacht|Good night
Tschüss|Bye
Auf Wiedersehen|Goodbye
Bis bald|See you soon
Bitte|Please / You're welcome
Danke|Thank you
Entschuldigung|Excuse me / Sorry
Ja|Yes
Nein|No
Wie geht's?|How are you?
Ich heiße...|My name is...
Ich verstehe nicht|I don't understand
Sprechen Sie Englisch?|Do you speak English?
eins|one
zwei|two
drei|three
vier|four
fünf|five
sechs|six
sieben|seven
acht|eight
neun|nine
zehn|ten
hundert|one hundred
der Tag|the day
die Woche|the week
heute|today
morgen|tomorrow
gestern|yesterday
jetzt|now
immer|always
nie|never
die Familie|the family
die Mutter|the mother
der Vater|the father
der Freund / die Freundin|the friend
der Mann|the man
die Frau|the woman
das Wasser|the water
das Brot|the bread
der Käse|the cheese
das Bier|the beer
der Kaffee|the coffee
das Fleisch|the meat
der Apfel|the apple
die Rechnung|the bill
das Haus|the house
die Tür|the door
der Tisch|the table
das Buch|the book
der Schlüssel|the key
das Geld|the money
die Stadt|the city
die Straße|the street
der Bahnhof|the train station
der Flughafen|the airport
die Fahrkarte|the ticket
das Auto|the car
sein|to be
haben|to have
gehen|to go
machen|to do / to make
wollen|to want
können|to be able to
wissen|to know
sehen|to see
essen|to eat
trinken|to drink
sprechen|to speak
wohnen|to live (reside)
groß|big
klein|small
gut|good
schlecht|bad
schön|beautiful
heiß|hot
kalt|cold
Wo ist...?|Where is...?
Wie viel kostet das?|How much does it cost?
Ich möchte...|I would like...
Ich habe Hunger|I am hungry
# More vocabulary
Freut mich|Nice to meet you
Können Sie das wiederholen?|Can you repeat that?
Langsamer, bitte|Slower, please
Ich weiß nicht|I don't know
Natürlich|Of course
Hilfe!|Help!
Was?|What?
Wer?|Who?
Warum?|Why?
Wann?|When?
Wie?|How?
Welcher?|Which?
zwanzig|twenty
fünfzig|fifty
tausend|one thousand
der Monat|the month
das Jahr|the year
der Morgen|the morning
der Abend|the evening
die Nacht|the night
die Stunde|the hour
später|later
manchmal|sometimes
das Kind|the child
der Bruder|the brother
die Schwester|the sister
der Sohn|the son
die Tochter|the daughter
der Ehemann|the husband
die Ehefrau|the wife
die Milch|the milk
das Ei|the egg
der Reis|the rice
die Suppe|the soup
das Obst|the fruit
der Zucker|the sugar
das Salz|the salt
der Fisch|the fish
das Frühstück|breakfast
das Abendessen|dinner
der Salat|the salad
das Zimmer|the room
die Küche|the kitchen
das Fenster|the window
der Stuhl|the chair
das Bett|the bed
das Telefon|the phone
die Tasche|the bag
die Toilette|the toilet
das Geschäft|the shop
der Supermarkt|the supermarket
das Restaurant|the restaurant
das Hotel|the hotel
der Zug|the train
der Bus|the bus
der Strand|the beach
rechts|to the right
links|to the left
geradeaus|straight ahead
nah|near
weit|far
kommen|to come
sagen|to say
geben|to give
nehmen|to take
arbeiten|to work
studieren|to study
kaufen|to buy
brauchen|to need
helfen|to help
anrufen|to call
ankommen|to arrive
denken|to think
finden|to find
schlafen|to sleep
lesen|to read
schreiben|to write
zuhören|to listen
warten|to wait
bezahlen|to pay
öffnen|to open
schließen|to close
anfangen|to begin
beenden|to finish
sich erinnern|to remember
vergessen|to forget
lieben|to love
lernen|to learn
verlassen|to leave
fragen|to ask
verstehen|to understand
neu|new
alt|old
teuer|expensive
billig|cheap
einfach|easy
schwierig|difficult
schnell|fast
langsam|slow
glücklich|happy
traurig|sad
müde|tired
krank|sick
voll|full
leer|empty
rot|red
blau|blue
grün|green
gelb|yellow
schwarz|black
weiß|white
der Kopf|the head
die Hand|the hand
das Auge|the eye
das Herz|the heart
`
        },
        // ------------------------------------------------------------------
        {
            id: 'italian', language: 'Italian', flag: 'IT', level: 'Basic → Intermediate',
            blurb: 'Everyday words, food, travel and the most useful verbs.',
            text: `
Ciao|Hi / Bye
Buongiorno|Good morning
Buonasera|Good evening
Buonanotte|Good night
Arrivederci|Goodbye
A presto|See you soon
Per favore|Please
Grazie|Thank you
Prego|You're welcome
Scusi|Excuse me
Mi dispiace|I am sorry
Sì|Yes
No|No
Come stai?|How are you?
Mi chiamo...|My name is...
Non capisco|I don't understand
Parla inglese?|Do you speak English?
uno|one
due|two
tre|three
quattro|four
cinque|five
sei|six
sette|seven
otto|eight
nove|nine
dieci|ten
cento|one hundred
il giorno|the day
la settimana|the week
oggi|today
domani|tomorrow
ieri|yesterday
adesso|now
sempre|always
mai|never
la famiglia|the family
la madre|the mother
il padre|the father
l'amico / l'amica|the friend
l'uomo|the man
la donna|the woman
l'acqua|the water
il pane|the bread
il formaggio|the cheese
il vino|the wine
il caffè|the coffee
la carne|the meat
il pollo|the chicken
la mela|the apple
il conto|the bill
la casa|the house
la porta|the door
il tavolo|the table
il libro|the book
la chiave|the key
i soldi|the money
la città|the city
la strada|the street
la stazione|the train station
l'aeroporto|the airport
il biglietto|the ticket
la macchina|the car
essere|to be
avere|to have
andare|to go
fare|to do / to make
volere|to want
potere|to be able to
sapere|to know
vedere|to see
mangiare|to eat
bere|to drink
parlare|to speak
abitare|to live (reside)
grande|big
piccolo|small
buono|good
cattivo|bad
bello|beautiful
caldo|hot
freddo|cold
Dov'è...?|Where is...?
Quanto costa?|How much does it cost?
Vorrei...|I would like...
Ho fame|I am hungry
# More vocabulary
Piacere|Nice to meet you
Può ripetere?|Can you repeat that?
Più lentamente, per favore|Slower, please
Non lo so|I don't know
Certo|Of course
Aiuto!|Help!
Cosa?|What?
Chi?|Who?
Perché?|Why?
Quando?|When?
Come?|How?
Quale?|Which?
venti|twenty
cinquanta|fifty
mille|one thousand
il mese|the month
l'anno|the year
la mattina|the morning
la sera|the evening
la notte|the night
l'ora|the hour
più tardi|later
a volte|sometimes
il bambino|the child
il fratello|the brother
la sorella|the sister
il figlio|the son
la figlia|the daughter
il marito|the husband
la moglie|the wife
il latte|the milk
l'uovo|the egg
il riso|the rice
la zuppa|the soup
la frutta|the fruit
lo zucchero|the sugar
il sale|the salt
il pesce|the fish
la colazione|breakfast
la cena|dinner
l'insalata|the salad
la camera|the room
la cucina|the kitchen
la finestra|the window
la sedia|the chair
il letto|the bed
il telefono|the phone
la borsa|the bag
il bagno|the toilet
il negozio|the shop
il supermercato|the supermarket
il ristorante|the restaurant
l'albergo|the hotel
il treno|the train
l'autobus|the bus
la spiaggia|the beach
a destra|to the right
a sinistra|to the left
sempre dritto|straight ahead
vicino|near
lontano|far
venire|to come
dire|to say
dare|to give
prendere|to take
lavorare|to work
studiare|to study
comprare|to buy
avere bisogno di|to need
aiutare|to help
chiamare|to call
arrivare|to arrive
pensare|to think
trovare|to find
dormir|to sleep
leggere|to read
scrivere|to write
ascoltare|to listen
aspettare|to wait
pagare|to pay
aprire|to open
chiudere|to close
cominciare|to begin
finire|to finish
ricordare|to remember
dimenticare|to forget
amare|to love
imparare|to learn
partire|to leave
chiedere|to ask
capire|to understand
nuovo|new
vecchio|old
caro|expensive
economico|cheap
facile|easy
difficile|difficult
veloce|fast
lento|slow
felice|happy
triste|sad
stanco|tired
malato|sick
pieno|full
vuoto|empty
rosso|red
blu|blue
verde|green
giallo|yellow
nero|black
bianco|white
la testa|the head
la mano|the hand
l'occhio|the eye
`
        },
        // ------------------------------------------------------------------
        {
            id: 'portuguese', language: 'Portuguese', flag: 'PT', level: 'Basic → Intermediate',
            blurb: 'Common phrases and vocabulary (European and Brazilian friendly).',
            text: `
Olá|Hello
Bom dia|Good morning
Boa tarde|Good afternoon
Boa noite|Good evening / Good night
Adeus|Goodbye
Até logo|See you later
Por favor|Please
Obrigado / Obrigada|Thank you
De nada|You're welcome
Desculpe|Excuse me / Sorry
Sim|Yes
Não|No
Como está?|How are you?
Chamo-me...|My name is...
Não entendo|I don't understand
Fala inglês?|Do you speak English?
um|one
dois|two
três|three
quatro|four
cinco|five
seis|six
sete|seven
oito|eight
nove|nine
dez|ten
cem|one hundred
o dia|the day
a semana|the week
hoje|today
amanhã|tomorrow
ontem|yesterday
agora|now
sempre|always
nunca|never
a família|the family
a mãe|the mother
o pai|the father
o amigo / a amiga|the friend
o homem|the man
a mulher|the woman
a água|the water
o pão|the bread
o queijo|the cheese
o vinho|the wine
o café|the coffee
a carne|the meat
a maçã|the apple
a conta|the bill
a casa|the house
a porta|the door
a mesa|the table
o livro|the book
a chave|the key
o dinheiro|the money
a cidade|the city
a rua|the street
a estação|the station
o aeroporto|the airport
o bilhete|the ticket
o carro|the car
ser|to be (permanent)
estar|to be (state / location)
ter|to have
ir|to go
fazer|to do / to make
querer|to want
poder|to be able to
saber|to know
ver|to see
comer|to eat
beber|to drink
falar|to speak
morar|to live (reside)
grande|big
pequeno|small
bom|good
mau|bad
bonito|beautiful
quente|hot
frio|cold
Onde fica...?|Where is...?
Quanto custa?|How much does it cost?
Queria...|I would like...
Tenho fome|I am hungry
# More vocabulary
Prazer em conhecê-lo|Nice to meet you
Pode repetir?|Can you repeat that?
Mais devagar, por favor|Slower, please
Não sei|I don't know
Claro|Of course
Socorro!|Help!
O quê?|What?
Quem?|Who?
Porquê?|Why?
Quando?|When?
Como?|How?
Qual?|Which?
vinte|twenty
cinquenta|fifty
mil|one thousand
o mês|the month
o ano|the year
a manhã|the morning
a tarde|the evening
a noite|the night
a hora|the hour
mais tarde|later
às vezes|sometimes
a criança|the child
o irmão|the brother
a irmã|the sister
o filho|the son
a filha|the daughter
o marido|the husband
a esposa|the wife
o leite|the milk
o ovo|the egg
o arroz|the rice
a sopa|the soup
a fruta|the fruit
o açúcar|the sugar
o sal|the salt
o peixe|the fish
o pequeno-almoço|breakfast
o jantar|dinner
a salada|the salad
o quarto|the room
a cozinha|the kitchen
a janela|the window
a cadeira|the chair
a cama|the bed
o telefone|the phone
a mala|the bag
a casa de banho|the toilet
a loja|the shop
o supermercado|the supermarket
o restaurante|the restaurant
o hotel|the hotel
o comboio|the train
o autocarro|the bus
a praia|the beach
à direita|to the right
à esquerda|to the left
sempre em frente|straight ahead
perto|near
longe|far
vir|to come
dizer|to say
dar|to give
levar|to take
trabalhar|to work
estudar|to study
comprar|to buy
precisar|to need
ajudar|to help
ligar|to call
chegar|to arrive
pensar|to think
encontrar|to find
dormir|to sleep
ler|to read
escrever|to write
ouvir|to listen
esperar|to wait
pagar|to pay
abrir|to open
fechar|to close
começar|to begin
terminar|to finish
lembrar|to remember
esquecer|to forget
amar|to love
aprender|to learn
sair|to leave
perguntar|to ask
compreender|to understand
novo|new
velho|old
caro|expensive
barato|cheap
fácil|easy
difícil|difficult
rápido|fast
lento|slow
feliz|happy
triste|sad
cansado|tired
doente|sick
cheio|full
vazio|empty
vermelho|red
azul|blue
verde|green
amarelo|yellow
preto|black
branco|white
a cabeça|the head
a mão|the hand
o olho|the eye
o coração|the heart
`
        },
        // ------------------------------------------------------------------
        {
            id: 'polish', language: 'Polish', flag: 'PL', level: 'Basic → Intermediate',
            blurb: 'Survival Polish: greetings, numbers, food, travel and key verbs.',
            text: `
Cześć|Hi / Bye
Dzień dobry|Good morning / Good day
Dobry wieczór|Good evening
Dobranoc|Good night
Do widzenia|Goodbye
Do zobaczenia|See you
Proszę|Please / Here you go
Dziękuję|Thank you
Przepraszam|Sorry / Excuse me
Tak|Yes
Nie|No
Jak się masz?|How are you?
Nazywam się...|My name is...
Nie rozumiem|I don't understand
Mówisz po angielsku?|Do you speak English?
jeden|one
dwa|two
trzy|three
cztery|four
pięć|five
sześć|six
siedem|seven
osiem|eight
dziewięć|nine
dziesięć|ten
sto|one hundred
dzień|day
tydzień|week
dzisiaj|today
jutro|tomorrow
wczoraj|yesterday
teraz|now
zawsze|always
nigdy|never
rodzina|family
matka|mother
ojciec|father
przyjaciel|friend
mężczyzna|man
kobieta|woman
woda|water
chleb|bread
ser|cheese
piwo|beer
kawa|coffee
herbata|tea
mięso|meat
kurczak|chicken
jabłko|apple
rachunek|bill
dom|house
drzwi|door
stół|table
książka|book
klucz|key
pieniądze|money
miasto|city
ulica|street
dworzec|train station
lotnisko|airport
bilet|ticket
samochód|car
być|to be
mieć|to have
iść|to go (on foot)
robić|to do / to make
chcieć|to want
móc|to be able to
wiedzieć|to know
widzieć|to see
jeść|to eat
pić|to drink
mówić|to speak
mieszkać|to live (reside)
duży|big
mały|small
dobry|good
zły|bad
piękny|beautiful
gorący|hot
zimny|cold
Gdzie jest...?|Where is...?
Ile to kosztuje?|How much does it cost?
Poproszę...|I would like... (ordering)
Jestem głodny|I am hungry
Na zdrowie!|Cheers!
# More vocabulary
Miło mi|Nice to meet you
Czy możesz powtórzyć?|Can you repeat that?
Wolniej, proszę|Slower, please
Nie wiem|I don't know
Oczywiście|Of course
Pomocy!|Help!
Co?|What?
Kto?|Who?
Dlaczego?|Why?
Kiedy?|When?
Jak?|How?
Który?|Which?
dwadzieścia|twenty
pięćdziesiąt|fifty
tysiąc|one thousand
miesiąc|month
rok|year
rano|morning
wieczór|evening
noc|night
godzina|hour
później|later
czasami|sometimes
dziecko|child
brat|brother
siostra|sister
syn|son
córka|daughter
mąż|husband
żona|wife
mleko|milk
jajko|egg
ryż|rice
zupa|soup
owoc|fruit
cukier|sugar
sól|salt
ryba|fish
śniadanie|breakfast
kolacja|dinner
sałatka|salad
pokój|room
kuchnia|kitchen
okno|window
krzesło|chair
łóżko|bed
telefon|phone
torba|bag
toaleta|toilet
sklep|shop
supermarket|supermarket
restauracja|restaurant
hotel|hotel
pociąg|train
autobus|bus
plaża|beach
w prawo|to the right
w lewo|to the left
prosto|straight ahead
blisko|near
daleko|far
przychodzić|to come
powiedzieć|to say
dawać|to give
brać|to take
pracować|to work
uczyć się|to study / to learn
kupować|to buy
potrzebować|to need
pomagać|to help
dzwonić|to call
przyjeżdżać|to arrive
myśleć|to think
znajdować|to find
spać|to sleep
czytać|to read
pisać|to write
słuchać|to listen
czekać|to wait
płacić|to pay
otwierać|to open
zamykać|to close
zaczynać|to begin
kończyć|to finish
pamiętać|to remember
zapominać|to forget
kochać|to love
wychodzić|to leave
pytać|to ask
rozumieć|to understand
nowy|new
stary|old
drogi|expensive
tani|cheap
łatwy|easy
trudny|difficult
szybki|fast
wolny|slow
szczęśliwy|happy
smutny|sad
zmęczony|tired
chory|sick
pełny|full
pusty|empty
czerwony|red
niebieski|blue
zielony|green
żółty|yellow
czarny|black
biały|white
głowa|head
ręka|hand
oko|eye
serce|heart
`
        },
        // ------------------------------------------------------------------
        {
            id: 'ukrainian', language: 'Ukrainian', flag: 'UA', level: 'Basic → Intermediate',
            blurb: 'Starter vocabulary in Cyrillic: greetings, numbers, food, travel.',
            text: `
Привіт|Hi
Добрий день|Good day
Добрий ранок|Good morning
Добрий вечір|Good evening
На добраніч|Good night
До побачення|Goodbye
Будь ласка|Please / You're welcome
Дякую|Thank you
Вибачте|Excuse me / Sorry
Так|Yes
Ні|No
Як справи?|How are you?
Мене звати...|My name is...
Я не розумію|I don't understand
Ви говорите англійською?|Do you speak English?
Слава Україні!|Glory to Ukraine!
один|one
два|two
три|three
чотири|four
п'ять|five
шість|six
сім|seven
вісім|eight
дев'ять|nine
десять|ten
сто|one hundred
день|day
тиждень|week
сьогодні|today
завтра|tomorrow
вчора|yesterday
зараз|now
завжди|always
ніколи|never
сім'я|family
мати|mother
батько|father
друг|friend
чоловік|man / husband
жінка|woman / wife
вода|water
хліб|bread
сир|cheese
кава|coffee
чай|tea
м'ясо|meat
яблуко|apple
рахунок|bill
дім|house
двері|door
стіл|table
книга|book
ключ|key
гроші|money
місто|city
вулиця|street
вокзал|train station
аеропорт|airport
квиток|ticket
машина|car
бути|to be
мати|to have
йти|to go (on foot)
робити|to do / to make
хотіти|to want
могти|to be able to
знати|to know
бачити|to see
їсти|to eat
пити|to drink
говорити|to speak
жити|to live
великий|big
малий|small
добрий|good
поганий|bad
гарний|beautiful
гарячий|hot
холодний|cold
Де...?|Where is...?
Скільки це коштує?|How much does it cost?
Я хочу...|I want...
Я голодний|I am hungry
Смачного!|Enjoy your meal!
# More vocabulary
Приємно познайомитись|Nice to meet you
Повторіть, будь ласка|Can you repeat that?
Повільніше, будь ласка|Slower, please
Я не знаю|I don't know
Звичайно|Of course
Допоможіть!|Help!
Що?|What?
Хто?|Who?
Чому?|Why?
Коли?|When?
Як?|How?
Який?|Which?
двадцять|twenty
п'ятдесят|fifty
тисяча|one thousand
місяць|month
рік|year
ранок|morning
вечір|evening
ніч|night
година|hour
пізніше|later
іноді|sometimes
дитина|child
брат|brother
сестра|sister
син|son
дочка|daughter
дружина|wife
молоко|milk
яйце|egg
рис|rice
суп|soup
фрукт|fruit
цукор|sugar
сіль|salt
риба|fish
сніданок|breakfast
вечеря|dinner
салат|salad
кімната|room
кухня|kitchen
вікно|window
стілець|chair
ліжко|bed
телефон|phone
сумка|bag
туалет|toilet
магазин|shop
супермаркет|supermarket
ресторан|restaurant
hotel|hotel
потяг|train
автобус|bus
пляж|beach
праворуч|to the right
ліворуч|to the left
прямо|straight ahead
близько|near
далеко|far
приходити|to come
казати|to say
давати|to give
брати|to take
працювати|to work
вчити|to study / to learn
купувати|to buy
потребувати|to need
допомагати|to help
дзвонити|to call
приїжджати|to arrive
думати|to think
знаходити|to find
спати|to sleep
читати|to read
писати|to write
слухати|to listen
чекати|to wait
платити|to pay
відкривати|to open
закривати|to close
починати|to begin
закінчувати|to finish
пам'ятати|to remember
забувати|to forget
любити|to love
виходити|to leave
питати|to ask
розуміти|to understand
новий|new
старий|old
дорогий|expensive
дешевий|cheap
легкий|easy
складний|difficult
швидкий|fast
повільний|slow
щасливий|happy
сумний|sad
втомлений|tired
хворий|sick
повний|full
порожній|empty
червоний|red
синій|blue
зелений|green
жовтий|yellow
чорний|black
білий|white
голова|head
рука|hand
око|eye
серце|heart
лікар|doctor
сонце|sun
`
        },
        // ------------------------------------------------------------------
        {
            id: 'japanese', language: 'Japanese', flag: 'JA', level: 'Basic → Intermediate',
            blurb: 'Essential words and phrases in kana/kanji with romaji in brackets.',
            text: `
こんにちは (konnichiwa)|Hello / Good afternoon
おはようございます (ohayō gozaimasu)|Good morning
こんばんは (konbanwa)|Good evening
おやすみなさい (oyasumi nasai)|Good night
さようなら (sayōnara)|Goodbye
ありがとうございます (arigatō gozaimasu)|Thank you
どういたしまして (dō itashimashite)|You're welcome
すみません (sumimasen)|Excuse me / Sorry
お願いします (onegai shimasu)|Please
はい (hai)|Yes
いいえ (iie)|No
お元気ですか (ogenki desu ka)|How are you?
私は…です (watashi wa … desu)|I am...
分かりません (wakarimasen)|I don't understand
英語を話せますか (eigo o hanasemasu ka)|Do you speak English?
一 (ichi)|one
二 (ni)|two
三 (san)|three
四 (yon / shi)|four
五 (go)|five
六 (roku)|six
七 (nana / shichi)|seven
八 (hachi)|eight
九 (kyū)|nine
十 (jū)|ten
百 (hyaku)|one hundred
今日 (kyō)|today
明日 (ashita)|tomorrow
昨日 (kinō)|yesterday
今 (ima)|now
いつも (itsumo)|always
家族 (kazoku)|family
母 (haha)|mother (my)
父 (chichi)|father (my)
友達 (tomodachi)|friend
男 (otoko)|man
女 (onna)|woman
水 (mizu)|water
パン (pan)|bread
肉 (niku)|meat
魚 (sakana)|fish
ご飯 (gohan)|rice / meal
お茶 (ocha)|tea
コーヒー (kōhī)|coffee
ビール (bīru)|beer
りんご (ringo)|apple
家 (ie)|house
ドア (doa)|door
本 (hon)|book
お金 (okane)|money
町 (machi)|town
駅 (eki)|train station
空港 (kūkō)|airport
切符 (kippu)|ticket
車 (kuruma)|car
トイレ (toire)|toilet
食べる (taberu)|to eat
飲む (nomu)|to drink
行く (iku)|to go
来る (kuru)|to come
見る (miru)|to see
する (suru)|to do
話す (hanasu)|to speak
買う (kau)|to buy
大きい (ōkii)|big
小さい (chiisai)|small
いい (ii)|good
悪い (warui)|bad
暑い (atsui)|hot (weather)
寒い (samui)|cold (weather)
美味しい (oishii)|delicious
どこですか (doko desu ka)|Where is it?
いくらですか (ikura desu ka)|How much is it?
お腹がすきました (onaka ga sukimashita)|I am hungry
いただきます (itadakimasu)|Said before eating
乾杯 (kanpai)|Cheers!
# More vocabulary
はじめまして (hajimemashite)|Nice to meet you
もう一度お願いします (mō ichido onegai shimasu)|Can you repeat that?
ゆっくりお願いします (yukkuri onegai shimasu)|Slower, please
知りません (shirimasen)|I don't know
もちろん (mochiron)|Of course
助けて (tasukete)|Help!
何 (nani)|What?
誰 (dare)|Who?
どうして (dōshite)|Why?
いつ (itsu)|When?
どう (dō)|How?
どれ (dore)|Which?
二十 (nijū)|twenty
五十 (gojū)|fifty
千 (sen)|one thousand
月 (tsuki)|month
年 (toshi)|year
朝 (asa)|morning
夕方 (yūgata)|evening
夜 (yoru)|night
時間 (jikan)|hour / time
後で (ato de)|later
時々 (tokidoki)|sometimes
子供 (kodomo)|child
兄 (ani)|older brother
姉 (ane)|older sister
息子 (musuko)|son
娘 (musume)|daughter
夫 (otto)|husband
妻 (tsuma)|wife
牛乳 (gyūnyū)|milk
卵 (tamago)|egg
スープ (sūpu)|soup
果物 (kudamono)|fruit
砂糖 (satō)|sugar
塩 (shio)|salt
朝ご飯 (asagohan)|breakfast
晩ご飯 (bangohan)|dinner
サラダ (sarada)|salad
部屋 (heya)|room
台所 (daidokoro)|kitchen
窓 (mado)|window
椅子 (isu)|chair
ベッド (beddo)|bed
電話 (denwa)|phone
かばん (kaban)|bag
店 (mise)|shop
スーパー (sūpā)|supermarket
レストラン (resutoran)|restaurant
ホテル (hoteru)|hotel
電車 (densha)|train
バス (basu)|bus
ビーチ (bīchi)|beach
右 (migi)|to the right
左 (hidari)|to the left
まっすぐ (massugu)|straight ahead
近い (chikai)|near
遠い (tōi)|far
言う (iu)|to say
あげる (ageru)|to give
取る (toru)|to take
働く (hataraku)|to work
勉強する (benkyō suru)|to study
必要 (hitsuyō)|to need / necessary
手伝う (tetsudau)|to help
電話する (denwa suru)|to call
着く (tsuku)|to arrive
思う (omou)|to think
見つける (mitsukeru)|to find
寝る (neru)|to sleep
読む (yomu)|to read
書く (kaku)|to write
聞く (kiku)|to listen / to ask
待つ (matsu)|to wait
払う (harau)|to pay
開ける (akeru)|to open
閉める (shimeru)|to close
始める (hajimeru)|to begin
終わる (owaru)|to finish
覚える (oboeru)|to remember
忘れる (wasureru)|to forget
愛する (aisuru)|to love
習う (narau)|to learn
出る (deru)|to leave
分かる (wakaru)|to understand
新しい (atarashii)|new
古い (furui)|old
高い (takai)|expensive / tall
安い (yasui)|cheap
簡単 (kantan)|easy
難しい (muzukashii)|difficult
速い (hayai)|fast
遅い (osoi)|slow
嬉しい (ureshii)|happy
悲しい (kanashii)|sad
疲れた (tsukareta)|tired
病気 (byōki)|sick / illness
いっぱい (ippai)|full
空 (kara)|empty
赤 (aka)|red
青 (ao)|blue
緑 (midori)|green
黄色 (kiiro)|yellow
黒 (kuro)|black
白 (shiro)|white
頭 (atama)|head
手 (te)|hand
目 (me)|eye
心 (kokoro)|heart
医者 (isha)|doctor
太陽 (taiyō)|sun
雨 (ame)|rain
木 (ki)|tree
海 (umi)|sea
風 (kaze)|wind
と (to)|and
または (mata wa)|or
でも (demo)|but
とても (totemo)|very
もっと (motto)|more
ここ (koko)|here
そこ (soko)|there
何か (nanika)|something
たくさん (takusan)|a lot
`
        },
        // ------------------------------------------------------------------
        {
            id: 'mandarin', language: 'Mandarin Chinese', flag: 'ZH', level: 'Basic → Intermediate',
            blurb: 'Simplified characters with pinyin in brackets.',
            text: `
你好 (nǐ hǎo)|Hello
早上好 (zǎoshang hǎo)|Good morning
晚上好 (wǎnshang hǎo)|Good evening
晚安 (wǎn'ān)|Good night
再见 (zàijiàn)|Goodbye
谢谢 (xièxie)|Thank you
不客气 (bú kèqi)|You're welcome
对不起 (duìbuqǐ)|Sorry
请 (qǐng)|Please
是 (shì)|Yes / to be
不是 (bú shì)|No / is not
你好吗 (nǐ hǎo ma)|How are you?
我叫… (wǒ jiào …)|My name is...
我不明白 (wǒ bù míngbai)|I don't understand
你会说英语吗 (nǐ huì shuō yīngyǔ ma)|Do you speak English?
一 (yī)|one
二 (èr)|two
三 (sān)|three
四 (sì)|four
五 (wǔ)|five
六 (liù)|six
七 (qī)|seven
八 (bā)|eight
九 (jiǔ)|nine
十 (shí)|ten
百 (bǎi)|one hundred
今天 (jīntiān)|today
明天 (míngtiān)|tomorrow
昨天 (zuótiān)|yesterday
现在 (xiànzài)|now
总是 (zǒngshì)|always
家 (jiā)|home / family
妈妈 (māma)|mom
爸爸 (bàba)|dad
朋友 (péngyou)|friend
男人 (nánrén)|man
女人 (nǚrén)|woman
水 (shuǐ)|water
面包 (miànbāo)|bread
米饭 (mǐfàn)|rice
肉 (ròu)|meat
鱼 (yú)|fish
茶 (chá)|tea
咖啡 (kāfēi)|coffee
啤酒 (píjiǔ)|beer
苹果 (píngguǒ)|apple
书 (shū)|book
钱 (qián)|money
城市 (chéngshì)|city
火车站 (huǒchēzhàn)|train station
机场 (jīchǎng)|airport
车 (chē)|car
厕所 (cèsuǒ)|toilet
吃 (chī)|to eat
喝 (hē)|to drink
去 (qù)|to go
来 (lái)|to come
看 (kàn)|to look / to watch
说 (shuō)|to speak
买 (mǎi)|to buy
有 (yǒu)|to have
要 (yào)|to want
大 (dà)|big
小 (xiǎo)|small
好 (hǎo)|good
热 (rè)|hot
冷 (lěng)|cold
好吃 (hǎochī)|tasty
在哪里 (zài nǎlǐ)|Where is it?
多少钱 (duōshao qián)|How much?
我饿了 (wǒ è le)|I am hungry
干杯 (gānbēi)|Cheers!
# More vocabulary
很高兴认识你 (hěn gāoxìng rènshi nǐ)|Nice to meet you
请再说一遍 (qǐng zài shuō yí biàn)|Can you repeat that?
请说慢一点 (qǐng shuō màn yìdiǎn)|Slower, please
我不知道 (wǒ bù zhīdào)|I don't know
当然 (dāngrán)|Of course
救命 (jiùmìng)|Help!
什么 (shénme)|What?
谁 (shéi)|Who?
为什么 (wèishénme)|Why?
什么时候 (shénme shíhou)|When?
怎么 (zěnme)|How?
哪个 (nǎge)|Which?
二十 (èrshí)|twenty
五十 (wǔshí)|fifty
千 (qiān)|one thousand
月 (yuè)|month
年 (nián)|year
早上 (zǎoshang)|morning
晚上 (wǎnshang)|evening / night
小时 (xiǎoshí)|hour
以后 (yǐhòu)|later
有时候 (yǒushíhou)|sometimes
孩子 (háizi)|child
哥哥 (gēge)|older brother
姐姐 (jiějie)|older sister
儿子 (érzi)|son
女儿 (nǚ'ér)|daughter
丈夫 (zhàngfu)|husband
妻子 (qīzi)|wife
牛奶 (niúnǎi)|milk
鸡蛋 (jīdàn)|egg
汤 (tāng)|soup
水果 (shuǐguǒ)|fruit
糖 (táng)|sugar
盐 (yán)|salt
早饭 (zǎofàn)|breakfast
晚饭 (wǎnfàn)|dinner
沙拉 (shālā)|salad
房间 (fángjiān)|room
厨房 (chúfáng)|kitchen
窗户 (chuānghu)|window
椅子 (yǐzi)|chair
床 (chuáng)|bed
手机 (shǒujī)|phone
包 (bāo)|bag
商店 (shāngdiàn)|shop
超市 (chāoshì)|supermarket
餐厅 (cāntīng)|restaurant
酒店 (jiǔdiàn)|hotel
火车 (huǒchē)|train
公共汽车 (gōnggòng qìchē)|bus
海滩 (hǎitān)|beach
右边 (yòubian)|to the right
左边 (zuǒbian)|to the left
一直走 (yìzhí zǒu)|straight ahead
近 (jìn)|near
远 (yuǎn)|far
告诉 (gàosu)|to tell
给 (gěi)|to give
拿 (ná)|to take
工作 (gōngzuò)|to work
学习 (xuéxí)|to study
需要 (xūyào)|to need
帮助 (bāngzhù)|to help
打电话 (dǎ diànhuà)|to call
到 (dào)|to arrive
想 (xiǎng)|to think / to want
找 (zhǎo)|to find
睡觉 (shuìjiào)|to sleep
读 (dú)|to read
写 (xiě)|to write
听 (tīng)|to listen
等 (děng)|to wait
付钱 (fù qián)|to pay
开 (kāi)|to open
关 (guān)|to close
开始 (kāishǐ)|to begin
结束 (jiéshù)|to finish
记得 (jìde)|to remember
忘记 (wàngjì)|to forget
爱 (ài)|to love
学 (xué)|to learn
离开 (líkāi)|to leave
问 (wèn)|to ask
懂 (dǒng)|to understand
新 (xīn)|new
旧 (jiù)|old
贵 (guì)|expensive
便宜 (piányi)|cheap
容易 (róngyì)|easy
难 (nán)|difficult
快 (kuài)|fast
慢 (màn)|slow
高兴 (gāoxìng)|happy
难过 (nánguò)|sad
累 (lèi)|tired
生病 (shēngbìng)|sick
满 (mǎn)|full
空 (kōng)|empty
红色 (hóngsè)|red
蓝色 (lánsè)|blue
绿色 (lǜsè)|green
黄色 (huángsè)|yellow
黑色 (hēisè)|black
白色 (báisè)|white
头 (tóu)|head
手 (shǒu)|hand
眼睛 (yǎnjing)|eye
心 (xīn)|heart
医生 (yīshēng)|doctor
太阳 (tàiyáng)|sun
雨 (yǔ)|rain
树 (shù)|tree
海 (hǎi)|sea
风 (fēng)|wind
和 (hé)|and
或者 (huòzhě)|or
但是 (dànshì)|but
因为 (yīnwèi)|because
很 (hěn)|very
更 (gèng)|more
也 (yě)|also
这里 (zhèlǐ)|here
那里 (nàlǐ)|there
东西 (dōngxi)|something / thing
没什么 (méi shénme)|nothing
很多 (hěn duō)|a lot
也许 (yěxǔ)|maybe
`
        },
        // ------------------------------------------------------------------
        {
            id: 'korean', language: 'Korean', flag: 'KO', level: 'Basic → Intermediate',
            blurb: 'Hangul with romanization in brackets.',
            text: `
안녕하세요 (annyeonghaseyo)|Hello
안녕히 가세요 (annyeonghi gaseyo)|Goodbye (to one leaving)
안녕히 계세요 (annyeonghi gyeseyo)|Goodbye (to one staying)
감사합니다 (gamsahamnida)|Thank you
천만에요 (cheonmaneyo)|You're welcome
죄송합니다 (joesonghamnida)|I am sorry
실례합니다 (sillyehamnida)|Excuse me
주세요 (juseyo)|Please give me
네 (ne)|Yes
아니요 (aniyo)|No
잘 지내세요? (jal jinaeseyo)|How are you?
저는 …입니다 (jeoneun … imnida)|I am...
이해 못 해요 (ihae mot haeyo)|I don't understand
영어 하세요? (yeongeo haseyo)|Do you speak English?
하나 (hana)|one
둘 (dul)|two
셋 (set)|three
넷 (net)|four
다섯 (daseot)|five
여섯 (yeoseot)|six
일곱 (ilgop)|seven
여덟 (yeodeol)|eight
아홉 (ahop)|nine
열 (yeol)|ten
백 (baek)|one hundred
오늘 (oneul)|today
내일 (naeil)|tomorrow
어제 (eoje)|yesterday
지금 (jigeum)|now
항상 (hangsang)|always
가족 (gajok)|family
어머니 (eomeoni)|mother
아버지 (abeoji)|father
친구 (chingu)|friend
남자 (namja)|man
여자 (yeoja)|woman
물 (mul)|water
빵 (ppang)|bread
밥 (bap)|rice / meal
고기 (gogi)|meat
생선 (saengseon)|fish
차 (cha)|tea
커피 (keopi)|coffee
맥주 (maekju)|beer
사과 (sagwa)|apple
집 (jip)|house
책 (chaek)|book
돈 (don)|money
도시 (dosi)|city
역 (yeok)|station
공항 (gonghang)|airport
표 (pyo)|ticket
자동차 (jadongcha)|car
화장실 (hwajangsil)|toilet
먹다 (meokda)|to eat
마시다 (masida)|to drink
가다 (gada)|to go
오다 (oda)|to come
보다 (boda)|to see
하다 (hada)|to do
말하다 (malhada)|to speak
사다 (sada)|to buy
있다 (itda)|to have / to exist
크다 (keuda)|big
작다 (jakda)|small
좋다 (jota)|good
나쁘다 (nappeuda)|bad
덥다 (deopda)|hot (weather)
춥다 (chupda)|cold (weather)
맛있다 (masitda)|delicious
어디예요? (eodiyeyo)|Where is it?
얼마예요? (eolmayeyo)|How much is it?
배고파요 (baegopayo)|I am hungry
건배 (geonbae)|Cheers!
# More vocabulary
만나서 반갑습니다 (mannaseo bangapseumnida)|Nice to meet you
다시 말해 주세요 (dasi malhae juseyo)|Can you repeat that?
천천히 말해 주세요 (cheoncheonhi malhae juseyo)|Slower, please
모르겠어요 (moreugesseoyo)|I don't know
물론이죠 (mullonijyo)|Of course
도와주세요 (dowajuseyo)|Help!
뭐 (mwo)|What?
누구 (nugu)|Who?
왜 (wae)|Why?
언제 (eonje)|When?
어떻게 (eotteoke)|How?
어느 (eoneu)|Which?
스물 (seumul)|twenty
오십 (osip)|fifty
천 (cheon)|one thousand
달 (dal)|month
년 (nyeon)|year
아침 (achim)|morning
저녁 (jeonyeok)|evening
밤 (bam)|night
시간 (sigan)|hour / time
나중에 (najunge)|later
가끔 (gakkeum)|sometimes
아이 (ai)|child
형 (hyeong)|older brother (of a man)
누나 (nuna)|older sister (of a man)
아들 (adeul)|son
딸 (ttal)|daughter
남편 (nampyeon)|husband
아내 (anae)|wife
우유 (uyu)|milk
계란 (gyeran)|egg
국 (guk)|soup
과일 (gwail)|fruit
설탕 (seoltang)|sugar
소금 (sogeum)|salt
아침 식사 (achim siksa)|breakfast
저녁 식사 (jeonyeok siksa)|dinner
샐러드 (saelleodeu)|salad
방 (bang)|room
부엌 (bueok)|kitchen
창문 (changmun)|window
의자 (uija)|chair
침대 (chimdae)|bed
전화 (jeonhwa)|phone
가방 (gabang)|bag
가게 (gage)|shop
슈퍼마켓 (syupeomaket)|supermarket
식당 (sikdang)|restaurant
호텔 (hotel)|hotel
기차 (gicha)|train
버스 (beoseu)|bus
해변 (haebyeon)|beach
오른쪽 (oreunjjok)|to the right
왼쪽 (oenjjok)|to the left
직진 (jikjin)|straight ahead
가깝다 (gakkapda)|near
멀다 (meolda)|far
주다 (juda)|to give
가지다 (gajida)|to take
일하다 (ilhada)|to work
공부하다 (gongbuhada)|to study
필요하다 (piryohada)|to need
돕다 (dopda)|to help
전화하다 (jeonhwahada)|to call
도착하다 (dochakhada)|to arrive
생각하다 (saenggakhada)|to think
찾다 (chatda)|to find
자다 (jada)|to sleep
읽다 (ikda)|to read
쓰다 (sseuda)|to write
듣다 (deutda)|to listen
기다리다 (gidarida)|to wait
지불하다 (jibulhada)|to pay
열다 (yeolda)|to open
닫다 (datda)|to close
시작하다 (sijakhada)|to begin
끝내다 (kkeutnaeda)|to finish
기억하다 (gieokhada)|to remember
잊다 (itda)|to forget
사랑하다 (saranghada)|to love
배우다 (baeuda)|to learn
떠나다 (tteonada)|to leave
묻다 (mutda)|to ask
이해하다 (ihaehada)|to understand
새로운 (saeroun)|new
오래된 (oraedoen)|old
비싸다 (bissada)|expensive
싸다 (ssada)|cheap
쉽다 (swipda)|easy
어렵다 (eoryeopda)|difficult
빠르다 (ppareuda)|fast
느리다 (neurida)|slow
행복하다 (haengbokhada)|happy
슬프다 (seulpeuda)|sad
피곤하다 (pigonhada)|tired
아프다 (apeuda)|sick
가득 찬 (gadeuk chan)|full
비어 있는 (bieo inneun)|empty
빨간색 (ppalgansaek)|red
파란색 (paransaek)|blue
초록색 (choroksaek)|green
노란색 (noransaek)|yellow
검은색 (geomeunsaek)|black
흰색 (huinsaek)|white
머리 (meori)|head
손 (son)|hand
눈 (nun)|eye
마음 (maeum)|heart / mind
의사 (uisa)|doctor
태양 (taeyang)|sun
비 (bi)|rain
나무 (namu)|tree
바다 (bada)|sea
바람 (baram)|wind
그리고 (geurigo)|and
또는 (ttoneun)|or
하지만 (hajiman)|but
왜냐하면 (waenyahamyeon)|because
아주 (aju)|very
더 (deo)|more
여기 (yeogi)|here
거기 (geogi)|there
무언가 (mueonga)|something
많이 (mani)|a lot
아마 (ama)|maybe
`
        },
        // ------------------------------------------------------------------
        {
            id: 'indonesian', language: 'Indonesian', flag: 'ID', level: 'Basic → Intermediate',
            blurb: 'Friendly, regular grammar: a great first language to pick up.',
            text: `
Halo|Hello
Selamat pagi|Good morning
Selamat siang|Good day (midday)
Selamat sore|Good afternoon
Selamat malam|Good evening / Good night
Sampai jumpa|See you
Tolong|Please (asking for help)
Silakan|Please (go ahead)
Terima kasih|Thank you
Sama-sama|You're welcome
Maaf|Sorry
Permisi|Excuse me
Ya|Yes
Tidak|No
Apa kabar?|How are you?
Nama saya...|My name is...
Saya tidak mengerti|I don't understand
Apakah Anda bisa bahasa Inggris?|Do you speak English?
satu|one
dua|two
tiga|three
empat|four
lima|five
enam|six
tujuh|seven
delapan|eight
sembilan|nine
sepuluh|ten
seratus|one hundred
hari|day
minggu|week
hari ini|today
besok|tomorrow
kemarin|yesterday
sekarang|now
selalu|always
tidak pernah|never
keluarga|family
ibu|mother
ayah|father
teman|friend
laki-laki|man
perempuan|woman
air|water
roti|bread
nasi|rice
daging|meat
ayam|chicken
ikan|fish
teh|tea
kopi|coffee
buah|fruit
apel|apple
rumah|house
pintu|door
meja|table
buku|book
kunci|key
uang|money
kota|city
jalan|street
stasiun|station
bandara|airport
tiket|ticket
mobil|car
makan|to eat
minum|to drink
pergi|to go
datang|to come
melihat|to see
berbicara|to speak
membeli|to buy
punya|to have
mau|to want
bisa|can / to be able to
besar|big
kecil|small
bagus|good
jelek|bad
panas|hot
dingin|cold
enak|delicious
Di mana...?|Where is...?
Berapa harganya?|How much is it?
Saya mau...|I would like...
Saya lapar|I am hungry
Selamat makan|Enjoy your meal
# More vocabulary
Senang bertemu dengan Anda|Nice to meet you
Bisa diulang?|Can you repeat that?
Lebih pelan, tolong|Slower, please
Saya tidak tahu|I don't know
Tentu saja|Of course
Tolong!|Help!
Apa?|What?
Siapa?|Who?
Mengapa?|Why?
Kapan?|When?
Bagaimana?|How?
Yang mana?|Which?
dua puluh|twenty
lima puluh|fifty
seribu|one thousand
bulan|month
tahun|year
pagi|morning
malam|night
sore|evening
jam|hour
nanti|later
kadang-kadang|sometimes
anak|child
kakak laki-laki|older brother
kakak perempuan|older sister
putra|son
putri|daughter
suami|husband
istri|wife
susu|milk
telur|egg
sup|soup
gula|sugar
garam|salt
sarapan|breakfast
makan malam|dinner
salad|salad
kamar|room
dapur|kitchen
jendela|window
kursi|chair
tempat tidur|bed
telepon|phone
tas|bag
toilet|toilet
toko|shop
supermarket|supermarket
restoran|restaurant
hotel|hotel
kereta|train
bus|bus
pantai|beach
kanan|to the right
kiri|to the left
lurus|straight ahead
dekat|near
jauh|far
mengatakan|to say
memberi|to give
mengambil|to take
bekerja|to work
belajar|to study / to learn
membutuhkan|to need
membantu|to help
menelepon|to call
tiba|to arrive
berpikir|to think
menemukan|to find
tidur|to sleep
membaca|to read
menulis|to write
mendengarkan|to listen
menunggu|to wait
membayar|to pay
membuka|to open
menutup|to close
mulai|to begin
selesai|to finish
ingat|to remember
lupa|to forget
mencintai|to love
meninggalkan|to leave
bertanya|to ask
mengerti|to understand
baru|new
lama|old
mahal|expensive
murah|cheap
mudah|easy
sulit|difficult
cepat|fast
lambat|slow
senang|happy
sedih|sad
lelah|tired
sakit|sick
penuh|full
kosong|empty
merah|red
biru|blue
hijau|green
kuning|yellow
hitam|black
putih|white
kepala|head
tangan|hand
mata|eye
hati|heart
dokter|doctor
matahari|sun
hujan|rain
pohon|tree
`
        },
        // ------------------------------------------------------------------
        {
            id: 'swedish', language: 'Swedish', flag: 'SV', level: 'Basic → Intermediate',
            blurb: 'Everyday Swedish: greetings, fika, travel and common verbs.',
            text: `
Hej|Hello
God morgon|Good morning
God dag|Good day
God kväll|Good evening
God natt|Good night
Hej då|Goodbye
Vi ses|See you
Snälla|Please
Tack|Thank you
Varsågod|You're welcome / Here you go
Ursäkta|Excuse me
Förlåt|Sorry
Ja|Yes
Nej|No
Hur mår du?|How are you?
Jag heter...|My name is...
Jag förstår inte|I don't understand
Pratar du engelska?|Do you speak English?
ett|one
två|two
tre|three
fyra|four
fem|five
sex|six
sju|seven
åtta|eight
nio|nine
tio|ten
hundra|one hundred
dag|day
vecka|week
idag|today
imorgon|tomorrow
igår|yesterday
nu|now
alltid|always
aldrig|never
familj|family
mamma|mom
pappa|dad
vän|friend
man|man
kvinna|woman
vatten|water
bröd|bread
ost|cheese
öl|beer
kaffe|coffee
fika|coffee-and-cake break
kött|meat
kyckling|chicken
äpple|apple
notan|the bill
hus|house
dörr|door
bord|table
bok|book
nyckel|key
pengar|money
stad|city
gata|street
station|station
flygplats|airport
biljett|ticket
bil|car
vara|to be
ha|to have
gå|to go / to walk
göra|to do / to make
vilja|to want
kunna|to be able to
veta|to know
se|to see
äta|to eat
dricka|to drink
tala|to speak
bo|to live
stor|big
liten|small
bra|good
dålig|bad
vacker|beautiful
varm|warm
kall|cold
Var är...?|Where is...?
Hur mycket kostar det?|How much does it cost?
Jag skulle vilja ha...|I would like...
Jag är hungrig|I am hungry
Skål!|Cheers!
# More vocabulary
Trevligt att träffas|Nice to meet you
Kan du upprepa?|Can you repeat that?
Långsammare, tack|Slower, please
Jag vet inte|I don't know
Självklart|Of course
Hjälp!|Help!
Vad?|What?
Vem?|Who?
Varför?|Why?
När?|When?
Hur?|How?
Vilken?|Which?
tjugo|twenty
femtio|fifty
tusen|one thousand
månad|month
år|year
morgon|morning
kväll|evening
natt|night
timme|hour
senare|later
ibland|sometimes
barn|child
bror|brother
syster|sister
son|son
dotter|daughter
make|husband
fru|wife
mjölk|milk
ägg|egg
ris|rice
soppa|soup
frukt|fruit
socker|sugar
salt|salt
fisk|fish
frukost|breakfast
middag|dinner
sallad|salad
rum|room
kök|kitchen
fönster|window
stol|chair
säng|bed
telefon|phone
väska|bag
toalett|toilet
butik|shop
snabbköp|supermarket
restaurang|restaurant
hotell|hotel
tåg|train
buss|bus
strand|beach
höger|to the right
vänster|to the left
rakt fram|straight ahead
nära|near
långt|far
komma|to come
säga|to say
ge|to give
ta|to take
arbeta|to work
studera|to study
köpa|to buy
behöva|to need
hjälpa|to help
ringa|to call
anlända|to arrive
tänka|to think
hitta|to find
sova|to sleep
läsa|to read
skriva|to write
lyssna|to listen
vänta|to wait
betala|to pay
öppna|to open
stänga|to close
börja|to begin
sluta|to finish
komma ihåg|to remember
glömma|to forget
älska|to love
lära sig|to learn
lämna|to leave
fråga|to ask
förstå|to understand
ny|new
gammal|old
dyr|expensive
billig|cheap
lätt|easy
svår|difficult
snabb|fast
långsam|slow
glad|happy
ledsen|sad
trött|tired
sjuk|sick
full|full
tom|empty
röd|red
blå|blue
grön|green
gul|yellow
svart|black
vit|white
`
        },
        // ------------------------------------------------------------------
        {
            id: 'turkish', language: 'Turkish', flag: 'TR', level: 'Basic → Intermediate',
            blurb: 'Greetings, numbers, food, travel and the most useful verbs.',
            text: `
Merhaba|Hello
Günaydın|Good morning
İyi akşamlar|Good evening
İyi geceler|Good night
Hoşça kal|Goodbye (to one staying)
Güle güle|Goodbye (to one leaving)
Lütfen|Please
Teşekkür ederim|Thank you
Rica ederim|You're welcome
Affedersiniz|Excuse me
Özür dilerim|I am sorry
Evet|Yes
Hayır|No
Nasılsın?|How are you?
Benim adım...|My name is...
Anlamıyorum|I don't understand
İngilizce biliyor musunuz?|Do you speak English?
bir|one
iki|two
üç|three
dört|four
beş|five
altı|six
yedi|seven
sekiz|eight
dokuz|nine
on|ten
yüz|one hundred
gün|day
hafta|week
bugün|today
yarın|tomorrow
dün|yesterday
şimdi|now
her zaman|always
asla|never
aile|family
anne|mother
baba|father
arkadaş|friend
adam|man
kadın|woman
su|water
ekmek|bread
peynir|cheese
çay|tea
kahve|coffee
et|meat
tavuk|chicken
elma|apple
hesap|bill
ev|house
kapı|door
masa|table
kitap|book
anahtar|key
para|money
şehir|city
sokak|street
istasyon|station
havalimanı|airport
bilet|ticket
araba|car
olmak|to be
gitmek|to go
gelmek|to come
yapmak|to do / to make
istemek|to want
bilmek|to know
görmek|to see
yemek|to eat
içmek|to drink
konuşmak|to speak
almak|to buy / to take
büyük|big
küçük|small
iyi|good
kötü|bad
güzel|beautiful
sıcak|hot
soğuk|cold
Nerede...?|Where is...?
Ne kadar?|How much?
...istiyorum|I would like...
Açım|I am hungry
Afiyet olsun|Enjoy your meal
Şerefe!|Cheers!
# More vocabulary
Memnun oldum|Nice to meet you
Tekrar eder misiniz?|Can you repeat that?
Daha yavaş, lütfen|Slower, please
Bilmiyorum|I don't know
Tabii ki|Of course
İmdat!|Help!
Ne?|What?
Kim?|Who?
Neden?|Why?
Ne zaman?|When?
Nasıl?|How?
Hangisi?|Which?
yirmi|twenty
elli|fifty
bin|one thousand
ay|month
yıl|year
sabah|morning
akşam|evening
gece|night
saat|hour
sonra|later
bazen|sometimes
çocuk|child
erkek kardeş|brother
kız kardeş|sister
oğul|son
kız|daughter
koca|husband
eş|spouse
süt|milk
yumurta|egg
pirinç|rice
çorba|soup
meyve|fruit
şeker|sugar
tuz|salt
balık|fish
kahvaltı|breakfast
akşam yemeği|dinner
salata|salad
oda|room
mutfak|kitchen
pencere|window
sandalye|chair
yatak|bed
telefon|phone
çanta|bag
tuvalet|toilet
dükkan|shop
market|supermarket
restoran|restaurant
otel|hotel
tren|train
otobüs|bus
plaj|beach
sağ|to the right
sol|to the left
düz|straight ahead
yakın|near
uzak|far
söylemek|to say
vermek|to give
çalışmak|to work
öğrenmek|to learn / to study
ihtiyaç duymak|to need
yardım etmek|to help
aramak|to call
varmak|to arrive
düşünmek|to think
bulmak|to find
uyumak|to sleep
okumak|to read
yazmak|to write
dinlemek|to listen
beklemek|to wait
ödemek|to pay
açmak|to open
kapatmak|to close
başlamak|to begin
bitirmek|to finish
hatırlamak|to remember
unutmak|to forget
sevmek|to love
ayrılmak|to leave
sormak|to ask
anlamak|to understand
yeni|new
eski|old
pahalı|expensive
ucuz|cheap
kolay|easy
zor|difficult
hızlı|fast
yavaş|slow
mutlu|happy
üzgün|sad
yorgun|tired
hasta|sick
dolu|full
boş|empty
kırmızı|red
mavi|blue
yeşil|green
sarı|yellow
siyah|black
beyaz|white
baş|head
el|hand
göz|eye
kalp|heart
doktor|doctor
bir şey|something
`
        }
    ];

    // ========================
    // Helpers
    // ========================

    function parse(text) {
        const cards = [];
        text.split('\n').forEach(line => {
            line = line.trim();
            if (!line || line.startsWith('#')) return;
            const idx = line.indexOf('|');
            if (idx <= 0) return;
            const word = line.substring(0, idx).trim();
            const translation = line.substring(idx + 1).trim();
            if (word && translation) {
                cards.push({
                    word,
                    translation,
                    sessionStatus: 'TO_REVIEW',
                    dueDate: null,
                    interval: 1,
                    easeFactor: 2.5
                });
            }
        });
        return cards;
    }

    function deckName(entry) {
        return `${entry.language} - English`;
    }

    function getAll() {
        return DECKS.map(e => ({
            id: e.id,
            language: e.language,
            flag: e.flag,
            level: e.level,
            blurb: e.blurb,
            name: deckName(e),
            count: parse(e.text).length
        }));
    }

    /** Build a fresh, ready-to-save deck object for the given premade id. */
    function buildDeck(id) {
        const entry = DECKS.find(e => e.id === id);
        if (!entry) return null;
        const deck = Config.createEmptyDeck(deckName(entry));
        deck.cards = parse(entry.text);
        return deck;
    }

    return { getAll, buildDeck };
})();
