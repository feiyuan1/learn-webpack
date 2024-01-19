import lodash from 'lodash'

const TestIndex = () => {
  const div = document.createElement('div')
  const p = document.createElement('p')
  p.innerText = lodash.join(['this is test index page', 'hhh'], '--')
  div.appendChild(p)
  return div
}

export default TestIndex