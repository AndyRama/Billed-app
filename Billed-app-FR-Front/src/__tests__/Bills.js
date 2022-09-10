/**
 * @jest-environment jsdom
 */

import { screen, waitFor } from "@testing-library/dom"
import userEvent from '@testing-library/user-event'
 import { toHaveClass } from "@testing-library/jest-dom"
 import BillsUI from "../views/BillsUI.js"
 import { bills } from "../fixtures/bills.js"
 import { ROUTES, ROUTES_PATH } from "../constants/routes.js";
 import { localStorageMock } from "../__mocks__/localStorage.js";
 import mockStore from "../__mocks__/store"
 
 import router from "../app/Router.js";
 import Bills from "../containers/Bills.js";

jest.mock("../app/Store", () => mockStore);

beforeEach(()=> {
  // simulate the connection on the Employee page by setting the localStorage
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
        console.log(windowIcon)
      })

      test("Then bills should be ordered from earliest to latest", () => {
        document.body.innerHTML = BillsUI({ data: bills })
        const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
        const antiChrono = (a, b) => ((a < b) ? 1 : +1)
        const datesSorted = [...dates].sort(antiChrono)
        expect(dates).toEqual(datesSorted)
      })
    })

    describe('When i click on new Bill', () => {
      test('Then I sould open a new page newBill', async() => {
        // afficher le page du rapport
        document.body.innerHTML = BillsUI({ data : [bills[0]] })
        // Récupérer le bouton 
        const btnNewBill = screen.getByTestId('btn-new-bill')
        // Récupérer intance de class bills
        const onNavigate = (pathname) => document.body.innerHTML = ROUTES({ pathname })
        const billsEmulation = new Bills({document, onNavigate, store:null, localStorage: window.localStorage})
        // Récupération du btn new bill
        const handleClickNewBill = jest.fn(() => billsEmulation.onNavigate(ROUTES_PATH['NewBill']))
        // Ajout d'un écouteur sur btn
        btnNewBill.addEventListener('click', handleClickNewBill)
        userEvent.click(btnNewBill)
        // Vérifier que le click est bien ecouté
        expect(handleClickNewBill).toHaveBeenCalled()
        // Vérifier que la page ouvert est NewBill sur le formulaire
        await waitFor(() => screen.getAllByTestId('form-new-bill'))
        expect(screen.getByTestId('form-new-bill')).toBeTruthy        
      })
    })  

    describe('When i click on icon eye ', () => {
      test('Then the preview modal I sould open', async() => {
        const onNavigate = (pathname) => document.body.innerHTML = ROUTES({ pathname })
        // Récupérer l'instance de la class Bills 
        const billsEmulation = new Bills({ document, onNavigate, store:null, localStorage:window.localStorage})
        // Afficher le page du rapport
        document.body.innerHTML = BillsUI({ data: [bills[0]] })
        // Récupérer la modale
        const modale = document.getElementById("modaleFile")
        $.fn.modal = jest.fn(() => modale.classList.add("show"))
        // Récupérer le bouton icon Eye 
        const iconEye = screen.getByTestId("icon-eye")
        const handleClickIconEye_1 = jest.fn(() => billsEmulation.handleClickIconEye(iconEye))
        // Ajout d'un écouteur sur btn
        iconEye.addEventListener('click',handleClickIconEye_1)
        userEvent.click(iconEye)
        // Vérifier que le click est bien ecouté
        expect(handleClickIconEye_1).toHaveBeenCalled()
        // Vérifier que la modal est ouvert 
        expect(modale).toHaveClass('show')
      })
    })  

    describe('When i click on others icon eye ', () => {
      test('Then the preview match the correct modal I sould open', async() => {
        const firestone = null
        // Récupérer l'instance de la class Bills 
        const billsEmulation = new Bills({ document, onNavigate, firestone, localStorage:window.localStorage})

        $.fn.modal = jest.fn() 
        // Récupérer le bouton icon Eye 
        const handleClickIconEye = jest.fn(billsEmulation.handleClickIconEye)
        const iconEyes = screen.getAllByTestId("icon-eye")
        iconEyes.forEach((icon) => {
          // Ajout d'un écouteur sur btn
          icon.addEventListener('click', (e) => handleClickIconEye(icon))
          userEvent.click(icon)
        })  
        expect(() => handleClickIconEye.toBeThrow())  
        expect(() => handleClickIconEye.toBeThrow(error))                
        // Vérifier que le click est bien ecouté
        expect(handleClickIconEye).toHaveBeenCalled()
        // Vérifier que la modal est ouvert 
        const modale = document.getElementById('modaleFile')
        expect(modale).toHaveClass("show")
      })
    })
  })
})
