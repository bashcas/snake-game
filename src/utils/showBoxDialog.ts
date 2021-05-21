const showBoxDialog = (score: number) => {
  const boxDialogEl = document.querySelector(".box-dialog")
  const scoreEl = document.querySelector(".score")
  scoreEl.textContent = `${score}`
  boxDialogEl.classList.remove("hidden")
}

export default showBoxDialog
