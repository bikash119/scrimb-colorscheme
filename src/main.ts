import './style.css'
import {Color, ColorMode, HEX, RGB, SchemeRequestQueryParams
  ,SchemeResponse
} from './types/color.ts'

const formEl:HTMLFormElement|null = document.querySelector<HTMLFormElement>('#scheme')
const selectedColorEl:HTMLInputElement|null = document.querySelector<HTMLInputElement>('#selected-color')
const schemeDisplayEl: HTMLDivElement| null = document.querySelector<HTMLDivElement>('#color-display')
const modeSelectorEl: HTMLDivElement| null = document.querySelector<HTMLDivElement>('#mode-selector')
const modeModalEl: HTMLDivElement| null = document.querySelector<HTMLDivElement>('#mode-modal')
const darkModeToggleElL: HTMLButtonElement|null = document.querySelector<HTMLButtonElement>("#dark-mode")
const colorapiBaseURL:URL = new URL("https://www.thecolorapi.com")
const schemeEndpoint: string = "scheme"
const colorIdentificationEndpoint: string = "id"
const count: number = 5
const selectedMode = ColorMode[0]
let isDarkMode = false

if(!formEl || !selectedColorEl || !schemeDisplayEl || !modeSelectorEl || !modeModalEl || !darkModeToggleElL)
  throw new Error("The required DOM elements are missing")

render(modeModalEl,selectedMode)

function render(modeModalEl: HTMLDivElement,selectedMode: string){
  
  while(modeSelectorEl!.firstChild){
    modeSelectorEl!.removeChild(modeSelectorEl!.firstChild)
  }
  while(darkModeToggleElL!.firstChild){
    darkModeToggleElL!.removeChild(darkModeToggleElL!.firstChild)
  }

  renderDarkModeToggle()
  const modeSelectorPEl = document.createElement('p')
  modeSelectorPEl.setAttribute('class','mr-auto pl-3 text-slate-400 capitalize')
  const modeSelectorSpanEl = document.createElement('span')
  modeSelectorSpanEl.setAttribute('class','ml-auto pr-6 text-slate-400 text-2xl')
  const modeSelectorDownArrow = document.createElement('i')
  modeSelectorDownArrow.setAttribute('class','fa-solid fa-angle-down')
  modeSelectorSpanEl.appendChild(modeSelectorDownArrow)
  modeSelectorPEl.textContent = selectedMode
  modeSelectorEl!.append(modeSelectorPEl,modeSelectorSpanEl)
  while(modeModalEl.firstChild){
    modeModalEl.removeChild(modeModalEl.firstChild)
  }
  const colorsOptionsEl = ColorMode.map((color,index) => {
      const divEl = document.createElement('div')
      const pEl = document.createElement('p')
      const spanEl = document.createElement('span')
      const iconEl = document.createElement('i')
      spanEl.append(iconEl)
      divEl.setAttribute('class','flex justify-between hover:bg-slate-400 hover:rounded-lg py-0.5 cursor-pointer')
      divEl.setAttribute('id',`${color}-${index}`)
      pEl.setAttribute('class','pl-1 py-1')
      pEl.textContent = color
      iconEl.setAttribute('class','fa-solid fa-check text-indigo-600')
      spanEl.setAttribute('class','pr-5 py-1 hidden')
      if(selectedMode === color){
        pEl.setAttribute('class','pl-1 py-1 font-bold')
        spanEl.classList.toggle('hidden')
      }

      divEl.append(pEl,spanEl)
      return divEl
  })
  modeModalEl.append(...colorsOptionsEl)
}

function renderDarkModeToggle(){
  const darkMoonIconEl = document.createElement('i')
  const darkModeSpanEl = document.createElement('span')
  darkModeSpanEl.append(darkMoonIconEl)
  darkModeToggleElL?.append(darkModeSpanEl)
  console.log("Dark Mode : ",isDarkMode)
  if (isDarkMode){
    darkMoonIconEl.setAttribute('class','fa-sharp fa-solid fa-sun text-gray-400 dark:text-white')
  }else{
    darkMoonIconEl.setAttribute('class','fa-solid fa-moon fa-sharp text-gray-400 dark:text-white')
  }
}
const populateSelectedMode = function(e:Event){
  if((e.target as HTMLElement).closest('#mode-modal')){
    modeModalEl.classList.toggle('hidden')
  }
  for (let i = 0; i < ColorMode.length; i++) {
    const selector = `#${ColorMode[i]}-${i}`;
    const closestElement = (e.target as HTMLElement).closest(selector);
    
    if (closestElement) {
      render(modeModalEl,ColorMode[i])
    }
  }
}
const toggleDarkMode = function(e:Event){
  if((e.target as HTMLElement).closest("#dark-mode")){
    document.documentElement.classList.toggle('dark')
    while(darkModeToggleElL!.firstChild){
      darkModeToggleElL!.removeChild(darkModeToggleElL!.firstChild)
    }
    isDarkMode = !isDarkMode
    renderDarkModeToggle()
  }
}
const toggleModeModal = function(e:Event){
  if((e.target as HTMLDivElement).closest('#mode-selector')){
    modeModalEl.classList.toggle('hidden')
  }
}
document.addEventListener('click',populateSelectedMode)
document.addEventListener('click',toggleDarkMode)
document.addEventListener('click',toggleModeModal)

const options = {
method: 'GET',
}

const prepareQueryParams = function(color:string, mode: ColorMode, count: number): SchemeRequestQueryParams{
const hex:HEX = { value: color, clean: color}
return {
  hex: hex.clean,
  mode: mode,
  count: count,
}
}
const stringifyQueryParams = (queryParams: SchemeRequestQueryParams) =>
`hex=${queryParams.hex}&mode=${queryParams.mode}&count=${queryParams.count}`

const prepareColors = (jsonColors: Record<string,any>[]): Color[] => {
let colors:Array<Color> = []
if (jsonColors.length > 0){
  colors = jsonColors.map((color) => {
      return {
          hex: color.hex,
          rgb: color.rgb
      }
  })
}
return colors

}

const displayColors = (colors:Color[]):HTMLDivElement[] => {
const colorDisplayDivs = colors.map((color,index) => {
  const schemeColorDiv = document.createElement("div")
  schemeColorDiv.setAttribute('id',`${color.hex.clean}-${index}`)
  schemeColorDiv.setAttribute('class','flex flex-col h-full w-1/5')
  const schemeColorInnerDiv = document.createElement('div')
  schemeColorInnerDiv.setAttribute('class','h-29/32 w-full ')
  schemeColorInnerDiv.style.background = color.hex.value
  // wrapper div for p and tooltip
  const pWrapperDiv = document.createElement('div')
  pWrapperDiv.setAttribute('class', 'relative group')

  //Paragraph element
  const schemePEl = document.createElement('p')
  schemePEl.textContent = color.hex.value
  schemePEl.setAttribute('class','p-2 font-bold font-Karla text-center dark:text-white')
  schemePEl.setAttribute('data-tooltip', 'Click to copy this color code')
  //span element to display tooltip
  const tooltip = document.createElement('span')
  tooltip.textContent = 'Click to copy this color code'
  tooltip.setAttribute('class', 
    'absolute hidden group-hover:block bottom-full left-1/2 transform -translate-x-1/2 px-2 py-1 ' +
    'bg-gray-800 text-white text-xs rounded whitespace-nowrap mb-1 ' +
    'opacity-0 group-hover:opacity-100 transition-opacity duration-200'
  )
  schemePEl.addEventListener('click',(e:Event) => {
    const hexCode = (e.target as HTMLParagraphElement).textContent
    navigator.clipboard.writeText(hexCode || '').then(() => {
      // Store original tooltip text
      const originalTooltipText = tooltip.textContent
      
      // Change tooltip text
      tooltip.textContent = "Copied!"
      
      // Reset tooltip text after 1.5 seconds
      setTimeout(() => {
        tooltip.textContent = originalTooltipText
      }, 1500)
    })
   })
  pWrapperDiv.append(schemePEl,tooltip)
  schemeColorDiv.append(schemeColorInnerDiv,pWrapperDiv)
  return schemeColorDiv
})
return colorDisplayDivs
}



const cleanSchemeDisplayEl = () => {
while(schemeDisplayEl.firstChild){
  schemeDisplayEl.removeChild(schemeDisplayEl.firstChild)
}
}

formEl.addEventListener('submit', (e:Event) => {
e.preventDefault()
const seedColor= selectedColorEl.value
const mode = modeSelectorEl.firstChild?.textContent
console.log(mode)
cleanSchemeDisplayEl()
let response:SchemeResponse = {mode:'',count:0,colors: []}
if (seedColor && mode){
  const cleanHex = seedColor.slice(1,seedColor.length)
  const params:String = stringifyQueryParams(prepareQueryParams(cleanHex,mode as ColorMode,count))
  console.log(params)
  fetch(colorapiBaseURL+schemeEndpoint+"?"+params,options)
      .then(res => res.json())
      .then(data => {
          response = {
              mode: data.mode,
              count: data.count,
              colors: prepareColors(data.colors)
          }
          schemeDisplayEl.append(...displayColors(response.colors))
      })
}

})