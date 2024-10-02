Reservation system – Frontend
English version of readme:
The frontend of the reservation system is built with React.js and communicates with the backend (Reservation System Backend on GitHub). Users can manage their profiles, view available services, book commodities, and manage system settings (for administrators and managers).
Main Features:
•	Login and Registration: User login, with JWT token stored and used for authentication.
•	Role-based Dashboards: Special dashboards for Admin, Manager, and User, each with different access levels.
•	Commodity Management: List and management of rooms, bars, and lifts.
•	Reservation System: Users can view available times for individual commodities and book time slots.
•	User Profile: Users can edit their personal information.
•	Display of Available Time Slots: Based on the selected commodity, the system shows available time slots for users to book.
Key Components:
•	LoginPage.js – User login and JWT token management.
•	RegistrationPage.js – Registration of a new user.
•	UserProfile.js – User profile display and editing.
•	AvailableCommodities.js – Displays available commodities and allows users to book time slots.
•	AdminDashboard.js, ManagerDashboard.js, UserDashboard.js – Role-specific dashboards for administrators, managers, and users.
•	CommoditiesControl.js – Admins and managers can manage commodities (rooms, bars, lifts).
•	Axios Configuration: Axios is used for API calls, ensuring JWT tokens are automatically added to requests.
How to Run the Frontend:
1.	Clone the repository and navigate to the frontend folder:
git clone https://github.com/your-username/reservation-system-frontend.git
cd frontend
2.	Install dependencies:
npm install react-router-dom axios
3.	Run the application:
npm start
4.	The application will be available at https://localhost:3000. Ensure that the backend is running and the HTTPS certificate is properly configured.
HTTPS Configuration for Frontend:
•	The frontend communicates with the backend over HTTPS using the Axios library. The Axios instance is configured to automatically include JWT tokens in every request and refresh tokens when they expire.
•	To ensure proper HTTPS communication between the frontend and backend, the browser needs to trust the certificate generated for the backend.
•	AXIOS - All communication between the frontend and backend is conducted over HTTPS, secured with JWT tokens.
Example User UI Screenshots (Making a Reservation):

 ![Screenshot_19](https://github.com/user-attachments/assets/23e51c53-f867-4c3c-8588-aeccdeb66291)
•	Screenshot 1: Time selection for a reservation. This screenshot shows the user interface where a user selects the date and time for booking a table in a bar. The user clicks on the desired date in the calendar and can then choose the time slot for the reservation.

![Screenshot_20](https://github.com/user-attachments/assets/20980850-88d8-42e1-b32a-716526434bab)
•	Screenshot 2: Successful reservation. In this image, the user has successfully made a reservation, which is displayed in the overview of past and current reservations. There is an option to cancel the reservation using the "Cancel Reservation" button.

 ![Screenshot_21](https://github.com/user-attachments/assets/5ad75cc0-16f2-421a-b625-b1a6e8b2a39e)
•	Screenshot 3: Available time slots for booking. This screenshot shows how available time slots for a specific commodity are displayed. The user can select the start and end times from the available slots and confirm the reservation using the "Reserve" button.
•	In the Reservations section, confirmed reservations are automatically updated.

Example Admin UI Screenshots (System Management):
 ![Screenshot_22](https://github.com/user-attachments/assets/ef99253f-48ea-4d19-bbe7-43d7b42b56ad)
•	Screenshot 4: Adjusting operating hours. The administrator can set and adjust the operating hours for various commodities, such as a bar or lift. It is also possible to reset the database, which will return the system to its default state.

 ![Screenshot_23](https://github.com/user-attachments/assets/54f13658-00ba-468a-9168-f3d2dccabdc3)
•	Screenshot 5: Modifying and creating new commodities. The administrator can edit commodity details such as name, capacity, or status and save the changes.

Example Manager UI Screenshots (Statistics):
![Screenshot_24](https://github.com/user-attachments/assets/0a22c9ad-e24f-4341-950e-e3a8dc6235a3)
•	Screenshot 6: User reservation statistics. This screenshot displays an overview of statistics and reports for individual users. For each user, you can see the total number of reservations, the most frequently booked commodity, and the number of past, active, and future reservations. This helps administrators and managers easily analyze system usage.



Czech version of readme:
Frontendová část rezervačního systému je postavena na React.js a komunikuje s backendem (Reservation system Backend on GitHub). Uživatelé mohou spravovat své profily, zobrazit dostupné služby, rezervovat komodity a spravovat nastavení systému (pro administrátory a manažery).

Hlavní Funkcionality:
•	Přihlášení a registrace: Uživatelské přihlášení, JWT token je uložen a používán pro autentizaci.
•	Dashboardy založené na rolích: Speciální dashboardy pro Admin, Manager a User, každý s různými úrovněmi přístupu.
•	Správa komodit: Seznam a správa pokojů, barů, lanovek.
•	Systém rezervací: Uživatelé vidí dostupné časy pro jednotlivé komodity a mohou si rezervovat časové sloty.
•	Profil uživatele: Uživatelé mohou upravovat své údaje.
•	Zobrazení dostupných časových bloků: Na základě vybrané komodity systém zobrazí volné časové sloty, které uživatel může rezervovat.

Hlavní Komponenty:
•	LoginPage.js – Přihlášení uživatele a správa JWT tokenu.
•	RegistrationPage.js – Registrace nového uživatele.
•	UserProfile.js – Zobrazení a editace profilu uživatele.
•	AvailableCommodities.js – Zobrazuje dostupné komodity a umožňuje rezervaci časových bloků.
•	AdminDashboard.js, ManagerDashboard.js, UserDashboard.js – Speciální dashboardy pro role.
•	CommoditiesControl.js – Admin a manažer mohou spravovat komodity (pokoje, bary, lanovky).
•	Axios konfigurace: Axios se používá pro volání API, zajišťuje automatické přidání JWT tokenu do požadavků.

Jak spustit frontend:
1.	Naklonujte repozitář a přejděte do složky frontend.
2.	Nainstalujte závislosti:
npm install react-router-dom axios
3.	Spusťte aplikaci:
npm start
4.	Aplikace bude dostupná na https://localhost:3000. Ujistěte se, že backend běží a HTTPS certifikát je nastaven správně.
________________________________________
HTTPS konfigurace pro frontend:
•	Frontend komunikuje s backendem přes HTTPS pomocí Axios knihovny. Axios instance je nastavena tak, aby přidávala JWT tokeny ke každému požadavku a automaticky obnovovala tokeny, pokud vyprší.
•	Pro správnou HTTPS komunikaci mezi frontendem a backendem je třeba zajistit, aby prohlížeč důvěřoval certifikátu vytvořenému pro backend.
•	AXIOS - Tímto způsobem se veškerá komunikace mezi frontendem a backendem provádí přes HTTPS a je zajištěna pomocí JWT tokenů.

Příkladné screenshoty user UI(tvorba rezervace):
![Screenshot_19](https://github.com/user-attachments/assets/23e51c53-f867-4c3c-8588-aeccdeb66291)
•  Screenshot 1: Výběr času rezervace
Tento screenshot ukazuje uživatelské rozhraní, kde uživatel vybírá datum a čas pro rezervaci stolu v baru. Uživatel klikne na požadované datum v kalendáři a následně si může vybrat časový blok pro rezervaci.
![Screenshot_20](https://github.com/user-attachments/assets/20980850-88d8-42e1-b32a-716526434bab)
•  Screenshot 2: Úspěšná rezervace
Na tomto obrázku uživatel již provedl rezervaci a ta je zobrazena v přehledu jeho minulých a současných rezervací. Je zde možnost rezervaci zrušit pomocí tlačítka "Zrušit rezervaci".
![Screenshot_21](https://github.com/user-attachments/assets/5ad75cc0-16f2-421a-b625-b1a6e8b2a39e)
•  Screenshot 3: Výběr volných časů pro rezervaci
Tento screenshot ukazuje, jak jsou zobrazeny dostupné časové bloky pro konkrétní komoditu. Uživatel si může vybrat začátek a konec rezervace z dostupných časů a poté potvrdit rezervaci tlačítkem "Rezervovat".
•  V sekci Rezervace se potvrzené rezervace automaticky aktualizovali.


Příkladné screenshoty admin UI(úprava systému):
![Screenshot_22](https://github.com/user-attachments/assets/ef99253f-48ea-4d19-bbe7-43d7b42b56ad)
•  Screenshot 4: Úprava provozních hodin
Administrátor má možnost nastavit a upravit provozní hodiny pro různé komodity, například bar nebo lanovku. Lze také resetovat databázi, což vrátí systém do výchozího stavu.
![Screenshot_23](https://github.com/user-attachments/assets/54f13658-00ba-468a-9168-f3d2dccabdc3)
•  Screenshot 5: Úprava komodit, tvorba nových
Administrátor může upravovat detaily komodit, jako je název, kapacita nebo stav, a uložit změny

Příkladné screenshoty manager UI(statistiky):
![Screenshot_24](https://github.com/user-attachments/assets/0a22c9ad-e24f-4341-950e-e3a8dc6235a3)
•  Screenshot 6: Statistiky rezervací uživatelů
Tento screenshot zobrazuje přehled statistik a reportů pro jednotlivé uživatele. U každého uživatele je vidět celkový počet rezervací, nejčastěji rezervovaná komodita, počet minulých, aktivních a budoucích rezervací, což slouží administrátorovi a manažerům ke snadné analýze využívání systému.


