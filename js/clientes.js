const d = document;
openModal = d.querySelector("[data-open]"),
  modal = d.querySelector(".modal"),
  $table = d.querySelector(".table"),
  $form = d.querySelector(".form"),
  $title = d.querySelector(".form-title"),
  $template = d.querySelector("#crud-template").content,
  numeroClientes = d.querySelector(".clientes"),
  $fragmento = d.createDocumentFragment(),
  isVisible = "is-visible";


/*Funcion que hara visible la ventana modal */
const crearModal =  () => {
 $title.textContent ="Agregar Cliente";
  $form.nombre.value = "";
  $form.email.value = "";
  $form.edad.value = "";
  $form.id.value = ""; 
  const modalId = openModal.dataset.open;
  document.getElementById(modalId).classList.add(isVisible);
};

/*funcion que captura el evento click del dom  */
d.addEventListener("click", (e) => {
  //aertura de modal
  if (e.target.matches(".fa-user-plus") || e.target.matches(".open-modal")) {
    crearModal();
  }
  if (e.target.matches(".close-modal")) {
    modal.classList.remove(isVisible);
  }
  if (e.target == d.querySelector(".modal.is-visible")) {
    modal.classList.remove(isVisible);
  }
  if (e.target.matches(".edit") || e.target.matches(".fa-user-edit")) {
      
    selecionar(e);
  }
  if (e.target.matches(".delete")|| e.target.matches(".fa-user-times")) {
    eliminarCliente(e);
  }
});

//funcion que captura los eventos de teclado del dom
d.addEventListener("keydown", (e) => {
  if (e.key == "Escape" && d.querySelector(".modal.is-visible")) {
    modal.classList.remove(isVisible);
  }
});

//funciones para manipulare la pi rest
const getAll = async () => {
  try {
    let respuesta = await fetch(
      "https://ge679d6c40046b0-test.adb.us-sanjose-1.oraclecloudapps.com/ords/admin/client/client"
    );
    let json1 = await respuesta.json();
    let data = await json1.items;
    if (!respuesta.ok) {
      throw {
        status: respuesta.status,
        statusText: respuesta.statusText,
      };
    }
    let contador=0;
    data.forEach((cliente) => {
      $template.querySelector(".nombre ").textContent = cliente.name;
      $template.querySelector(".email").textContent = cliente.email;
      $template.querySelector(".edad").textContent = cliente.age;
      $template.querySelector(".edit").dataset.nombre = cliente.name;
      $template.querySelector(".edit").dataset.email = cliente.email;
      $template.querySelector(".edit").dataset.edad = cliente.age;
      $template.querySelector(".edit").dataset.id = cliente.id;
      $template.querySelector(".edit i").dataset.nombre = cliente.name;
      $template.querySelector(".edit i").dataset.email = cliente.email;
      $template.querySelector(".edit i").dataset.edad = cliente.age;
      $template.querySelector(".edit i").dataset.id = cliente.id;
      $template.querySelector(".delete").dataset.id = cliente.id;
      $template.querySelector(".delete ").dataset.nombre = cliente.name;
      if (contador % 2 == 0) {
        $template.querySelector("tr").classList.add("fila2");
      }else if(contador % 2 ==1){
    
        $template.querySelector("tr").classList.add("fila1");
      }
      let $clones = d.importNode($template, true);
      $fragmento.appendChild($clones);
	  $template.querySelector("tr").classList.remove("fila1");
	  $template.querySelector("tr").classList.remove("fila2");
	  contador++;
    });
    $table.querySelector("tbody").appendChild($fragmento);
	numeroClientes.textContent=contador;
  } catch (error) {
    let message = error.statusText || "Ocurrio Un Erro";
    $table.insertAdjacentHTML(
      "afterend",
      `<p><b>Error ${error.status} ${message}</b></p>`
    );
  }
};

d.addEventListener("DOMContentLoaded", getAll);

d.addEventListener("submit", async(e) => {
  if (e.target === $form) {
   
    if (!e.target.id.value) {
				 agregarCliente(e);
  
    } else {
			actualizarCliente(e);
    }
  }
});

const selecionar = async (e,) => {
  
  $title.textContent = "Editar Cliente";
  $form.nombre.value = e.target.dataset.nombre;
  $form.email.value =  e.target.dataset.email;
  $form.edad.value = e.target.dataset.edad;
  $form.id.value = e.target.dataset.id;
  const modalId = await openModal.dataset.open;
  document.getElementById(modalId).classList.add(isVisible);



};

const actualizarCliente = async (e) => {
  try {
    let options = {
      method: "PUT",
      headers: {
        "Content-type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        id: e.target.id.value,
        name: e.target.nombre.value,
        email: e.target.email.value,
        age: e.target.edad.value,
      }),
				};

    let respuesta = await fetch(
      "https://ge679d6c40046b0-test.adb.us-sanjose-1.oraclecloudapps.com/ords/admin/client/client",
      options
				);
    

    if (!respuesta.ok) {
      throw {
        status: respuesta.status,
        statusText: respuesta.statusText,
      };
    }  
    location.reload();
  } catch (error) {
    let message = error.statusText || "Ocurrio un error";
    $form.insertAdjacentHTML(
      "afterend",
      `<p><b>Error ${error.status} ${message}</b></p>`
    );
    
  }
};

const agregarCliente = async (e) => {

  try {
    let options = {
      method: "POST",
      headers: {
        "Content-type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        name: e.target.nombre.value,
        email: e.target.email.value,
        age: e.target.edad.value,
      }),
    };
    let respuesta = await fetch("https://ge679d6c40046b0-test.adb.us-sanjose-1.oraclecloudapps.com/ords/admin/client/client",
      options
    );
   
     if (!respuesta.ok) {
      throw {
        status: respuesta.status,
        statusText: respuesta.statusText,
      };
    } 
   location.reload();
  } catch (error) {
    let message = error.statusText || "Ocurrio un error";
    $form.insertAdjacentHTML(
      "afterend",
      `<p><b>Error ${error.status} ${message}</b></p>`
    );
    
  }
};

const eliminarCliente = async (e) => {
  let isDelete = confirm(
    `Estas seguro de eliminar el cliente: ${e.target.dataset.nombre}`
  );
  if (isDelete) {
    try {
      let options = {
          method: "DELETE",
          headers: {
            "Content-type": "application/json; charset=utf-8",
          },
		 body: JSON.stringify({
			id:e.target.dataset.id
		  }),
        },
        respuesta = await fetch("https://ge679d6c40046b0-test.adb.us-sanjose-1.oraclecloudapps.com/ords/admin/client/client", options);
	
      console.log(respuesta);
      if (!respuesta.ok) {
        throw {
          status: respuesta.status,
          statusText: respuesta.statusText,
        };
      }
      location.reload();
    } catch (error) {

		let message = error.statusText || "Ocurrio un error";
        $form.insertAdjacentHTML(
          "afterend",
          `<p><b>Error${error.status} ${message}</b></p>`
        );
	}
  }
};
