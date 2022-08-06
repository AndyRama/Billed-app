/**
 * @jest-environment jsdom
 */

import {screen, waitFor} from "@testing-library/dom"
import { toHaveClass } from "@testing-library/jest-dom"
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import { ROUTES, ROUTES_PATH} from "../constants/routes.js";
import {localStorageMock} from "../__mocks__/localStorage.js";

import router from "../app/Router.js";
import Bills from "../containers/Bills.js";
import userEvent from "@testing-library/user-event";
import NewBill from "../containers/NewBill.js";

beforeEach(()=> {
  // On simule une connection page employee en paramétrant le stockage local
  Object.defineProperty(window, 'localStorage', { value: localStorageMock })
  window.localStorage.setItem('user', JSON.stringify({
    type: 'Employee'
  }))
})
describe('Bills Unit test suites', () => {
  
  describe("Given I am connected as an employee", () => {
    describe("When I am on Bills Page", () => {
      test("Then bill icon in vertical layout should be highlighted", async () => {
        const root = document.createElement("div")
        root.setAttribute("id", "root")
        document.body.append(root)
        router()
        window.onNavigate(ROUTES_PATH.Bills)
        await waitFor(() => screen.getByTestId('icon-window'))
        const windowIcon = screen.getByTestId('icon-window')
        expect(windowIcon).toHaveClass('active-icon')
      })

      test("Then bills should be ordered from earliest to latest", () => {
        document.body.innerHTML = BillsUI({ data: bills })
        const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
        const antiChrono = (a, b) => ((a < b) ? 1 : +1)
        const datesSorted = [...dates].sort(antiChrono)
        expect(dates).toEqual(datesSorted)
      })
    })
    // Nous souhaitons tester lorsque utilisateur est connecté en tant qu'employé et qu'il veut crée une nouvelle note de frais.
    describe("When i click on New", () => {
      test("Then bills sould be open" , async () => {
        document.body.innerHTML = BillsUI( { data: [bills[0]] })
        const btnNewBill = screen.getByTestId('btn-new-bill')
        // récupération de l'instance de bills 
        const onNavigate = (pathname) => document.body.innerHTML = ROUTES({ pathname })
        const billsEmulation = new Bills({ document, onNavigate, store : null, localStorage: window.localStorage })
        // ajout d'un add eventListener  sur le bouton 
        const handleClickNewBill = jest.fn(() => billsEmulation.onNavigate(ROUTES_PATH['NewBill']))
        btnNewBill.addEventListener('click', handleClickNewBill)
        userEvent.click(btnNewBill)
        // vérifier que l'on est sur la bonne page 
        expect(handleClickNewBill).toHaveBeenCalled()
        await waitFor(() => screen.getAllByTestId('form-new-bill'))
        expect(screen.getAllByTestId('form-new-bill')).toBeTruthy()
      })
    })
  })
})