function AddTask(){
    
    let taskInput = document.getElementById("testTask");
    let taskText = taskInput.value.trim();

    if (taskText ===""){
        alert("WTF this is EMPTY");
        return;}

    let Tasks= document.createElement("li");

    Tasks.innerHTML = `
      <span onclick="toggleTask(this)">${taskText} </span>
      <button onclick="removeTask(this)">❌</button>
        
      `;
      
      
  taskList.appendChild(Tasks);
  taskInput.value = "";


} function removeTask(button) {
    button.parentElement.remove();
}

function toggleTask(span) {
    span.classList.toggle("completed");
}




