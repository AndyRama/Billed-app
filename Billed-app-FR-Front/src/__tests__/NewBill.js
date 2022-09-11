/**
 * @jest-environment jsdom
 */

import { fireEvent, getByTestId, screen } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { localStorageMock } from"../__mocks__/localStorage.js"
import mockStore from "../__mocks__/store"
import userEvent from "@testing-library/user-event"
import router from "../app/Router"
import { ROUTES, ROUTES_PATH } from "../constants/routes.js"


jest.mock("../app/Store", () => mockStore)

beforeEach(()=> {
  // simulate the connection on the Employee page by setting the localStorage
  Object.defineProperty(window, 'localStorage', { value: localStorageMock })
  window.localStorage.setItem('user', JSON.stringify({
    type: 'Employee',
    email: 'employee@test.tld'
  }))
  // Afficher la page nouvelle note de frais
  document.body.innerHTML = NewBillUI()
})

//Test for NewBill Submit form 
describe("NewBill Unit test suites", () => {
  describe("Given I am connected as an employee", () => {
    describe("When I am on NewBill page", () => {
      test("Then Isubmit a compete NewBills form and redirected on bill, methode Post", async() => {
      // route
      document.body.innerHTML = `<div id="root"></div>`; 
      router()
      window.onNavigate(ROUTES_PATH.NewBill)
      // value for Expense-name
      const expenseName = screen.getByTestId("expense-name")
      expenseName.value ='Hôtel'
      // value for Datepicker
      const datePicker = screen .getByTestId("datepicker")
      datePicker.vaue = "2022-07-25"
      // value for Amount
      const amount = screen.getByTestId("amount")
      amount.value = "240"
      // value for TVA
      const tva = screen.getByTestId("vat")
      tva.value = "30"
      // value for Pct
      const pct = screen.getByTestId("pct")
      pct.value = "20"
      // File and fireEvent
      const file = screen.getByTestId("file")
      fireEvent.change(file, {
        target: {
          files: [new File(['(⌐□_□)'], 'chucknorris.png', { type: 'image/png'})],
        },
      })
      // Form Submission
      const formSubmission = screen.getByTestId('form-new-bill')
      const newBillEmulation = new NewBill( { document, onNavigate, store: mockStore, localStorage: window.localStorage })
      const handleSubmit = jest.fn((e) => { newBillEmulation.handleSubmit(e)})
      // addEventListener on form
      formSubmission.addEventListener('submit', handleSubmit)
      fireEvent.submit(formSubmission)
      expect(handleSubmit).toHaveBeenCalled() 
      })
    })
  })
})

describe("NewBill Unit test suites", () => {
  describe("Given I am connected as an employee", () => {
    describe("When I am on NewBill page", () => {
      describe("When I try to load a picture", () => {
        test("Then file sould be an picture", () => {
          // Récupération input file
          const newFile = screen.getByTestId('file')
          // Récupération de nouvelle instance de NewBill
          const onNavigate = (pathname) => document.body.innerHTML = ROUTES({ pathname })
          const newBillEmulation = new NewBill({ document, onNavigate, store: mockStore, localStorage: window.localStorage })
          const handleChangeFile = jest.fn((e) => newBillEmulation.handleChangeFile(e))
          // addEventListener handleChangeFile
          newFile.addEventListener("change", handleChangeFile)
          userEvent.click(newFile)
          //  Vérifié si le fichier est bien une image
          fireEvent.change(newFile, {
            target: {
              files: [new File(['(⌐□_□)'], 'chucknorris.png', { type: 'image/png'})],
            },
          })
          expect(newFile.files[0].type).toMatch(/(image\/jpg)|(image\/jpeg)|(image\/png)/gm)
        })

        test("then file should not be an image", ( )=> {
          const jsdomAlert = window.alert;
          window.alert = () => { };

          // Récupération input file
          const newFile = screen.getByTestId('file')
          // Récupération de nouvelle instance de NewBill
          const onNavigate = (pathname) => document.body.innerHTML = ROUTES({ pathname })
          const newBillEmulation = new NewBill({ document, onNavigate, store: mockStore, localStorage: window.localStorage })
          const handleChangeFile = jest.fn((e) => newBillEmulation.handleChangeFile(e))
          // addEventListener handleChangeFile
          newFile.addEventListener("change", handleChangeFile)
          userEvent.click(newFile)
          //  Vérifié si le fichier est bien une image
          fireEvent.change(newFile, {
            target: {
              files: [new File(['(⌐□_□)'], 'chucknorris.txt', {type: 'text/plain'})],
            },
          })
          expect(newFile.files[0].type).not.toMatch(/(image\/jpg)|(image\/jpeg)|(image\/png)/gm)
          window.alert = jsdomAlert;
          // restore the jsdom alert
        })
      })
    })
  })
})

// Test d'intégration POST
