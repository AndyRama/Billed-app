/**
 * @jest-environment jsdom
 */

import {screen, waitFor} from "@testing-library/dom"
import { toHaveClass } from "@testing-library/jest-dom"
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import { ROUTES_PATH} from "../constants/routes.js";
import {localStorageMock} from "../__mocks__/localStorage.js";
import Bills from "../containers/Bills.js";

import router from "../app/Router.js";

jest.mock("../app/Store", () => mockStore)

beforeEach(() => {
  // simulation de l'utilisateur en parametrant le stockage local
  Object.defineProperty(window, 'localStorage', { value: localStorageMock })
  window.localStorage.setItem('user', JSON.stringify({
    type: 'Employee'
  }))
})

describe("Bills Unit test suites", () => {
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

      // TEST BTN NEW \\
      
      // Quand je click sur new bills
      test("When i click on New", () => {
        // Alors Une fenetre devrait s'ouvrir
        then("A new window sould be open", async() => {
        // On doit afficher newBills
        document.body.innerHTML = BillsUI({ data: bills[0] })
        // On récupérait le BTN
        const buttonNewBill = screen.getAllByTestId('btn-new-bill')
        // On récupérait l'instance du BTN
        // On met un écouteur sur le boutton
        // On vérifie le bouton est bien ecouté
        // On vérifie que la page est bien ouverte sur NewBill
        })
      })

      // TEST BTN ICON EYES
      // TEST MOCK API
      // TEST 400
      // TEST 500
    })
  })
})
