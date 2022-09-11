/**
 * @jest-environment jsdom
 */

import { fireEvent, screen } from "@testing-library/dom"
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

describe("NewBills Unit test suites" ,() => {
  describe("Given I am connected as an employee", () => {
    describe("When I am on NewBill Page", () => {
      describe("When I try to load a picture", () => {
        test("Then file sould be an picture", () => {
          // Récupération input file
          const newFile = screen.getByTestId("file")
          // Récupération de nouvelle instance NewBill
          const onNavigate = (pathname) => document.body.innerHTML = ROUTES( { pathname })
          const newBillEmulation = new NewBill({ document, onNavigate, store:mockStore, localStorage:window.localStorage })
          const handleChangeFile = jest.fn((e) => newBillEmulation.handleChangeFile(e))
          // AddEventListener handleChangeFile
          newFile.addEventListener('change', handleChangeFile)
          userEvent.click(newFile)
          // Vérifier si le fichier est une image
          fireEvent.change(newFile, {
            target: {
              files:[ new File(['(⌐□_□)'], 'chucknorris.png', { type: 'image/png' })],
            },
          })
          expect(newFile.file[0].type).toMatch(/(image\/jpg) | (image\/jpeg) | (image\/png)/gm)
        })

        test("then file sould be not an image ", () => {
          const jsdomAlert = window.alert;
          window.alert = () => { };

           // Récupération input file
           const newFile = screen.getByTestId("file")
           // Récupération de nouvelle instance NewBill
           const onNavigate = (pathname) => document.body.innerHTML = ROUTES( { pathname })
           const newBillEmulation = new NewBill({ document, onNavigate, store:mockStore, localStorage:window.localStorage })
           const handleChangeFile = jest.fn((e) => newBillEmulation.handleChangeFile(e))
           // AddEventListener handleChangeFile
           newFile.addEventListener('change', handleChangeFile)
           userEvent.click(newFile)
           // Vérifier si le fichier est une image
           fireEvent.change(newFile, {
             target: {
               files:[ new File(['(⌐□_□)'], 'chucknorris.txt', { type: 'text/plain' })],
             },
           })
           expect(newFile.file[0].type).not.toMatch(/(image\/jpg) | (image\/jpeg) | (image\/png)/gm)
           // Restore the jsdom alert 
           window.alert = jsdomAlert;
        })
      })
    })
  })
})

// Test Newbilll submit form
// Test d'intégration POST
