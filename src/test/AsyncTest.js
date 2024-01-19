const asyncTestIndex = async() => {
  const div = document.createElement('div')
  const p = document.createElement('p')
  await import("lodash")
    .then(({ default: _ }) => {
      p.innerHTML = _.join(['this is test index page', 'hhh'], '--')
    });
  div.appendChild(p)
  return div
}

export default asyncTestIndex

