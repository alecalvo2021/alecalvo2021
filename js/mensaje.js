const d = document;
openModal = d.querySelector("[data-open]"),
  modal = d.querySelector(".modal"),
  $table = d.querySelector(".table"),
  $form = d.querySelector(".form"),
  $title = d.querySelector(".form-title"),
  $template = d.querySelector("#crud-template").content,
  numeroMensajes = d.querySelector(".mensajes"),
  $fragmento = d.createDocumentFragment(),
  isVisible = "is-visible";


/*Funcion que hara visible la ventana modal */
const crearModal =  () => {
  $title.textContent ="Agregar Mensaje";
  $form.mensagge.value="";
  const modalId = openModal.dataset.open;
  document.getElementById(modalId).classList.add(isVisible);
};

/*funcion que captura el evento click del dom  */
d.addEventListener("click", (e) => {

  if (e.target.matches(".fa-plus-square") || e.target.matches(".open-modal")) {
    crearModal();
  }
  if (e.target.matches(".close-modal")) {
    modal.classList.remove(isVisible);
  }
  if (e.target == d.querySelector(".modal.is-visible")) {
    modal.classList.remove(isVisible);
  }
  if (e.target.matches(".edit") || e.target.matches(".fa-edit")) {
    selecionar(e);
  }
  if (e.target.matches(".delete")|| e.target.matches(".fa-trash-alt")) {
    eliminarMensaje(e);
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
      "https://ge679d6c40046b0-test.adb.us-sanjose-1.oraclecloudapps.com/ords/admin/message/message"
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
    data.forEach((contenido) => {
        console.log(contenido.messagetext);

     $template.querySelector(".mensaje ").textContent = contenido.messagetext;
      $template.querySelector(".edit").dataset.mensaje = contenido.messagetext;
      $template.querySelector(".edit").dataset.id = contenido.id;
 
      $template.querySelector(".edit i").dataset.mensaje = contenido.messagetext;
      $template.querySelector(".edit i").dataset.idd = contenido.id;
      $template.querySelector(".delete").dataset.id = contenido.id;
      $template.querySelector(".delete ").dataset.mensaje = contenido.messagetext; 
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
    numeroMensajes.textContent=contador;
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
		agregarMensaje(e);
        
    } else {
			actualizarMensaje(e);
    }
  }
});

const selecionar = async (e,) => {
  $title.textContent = "Editar Mensaje";
  $form.mensagge.value = e.target.dataset.mensaje;
  $form.id.value = e.target.dataset.id;
  const modalId = await openModal.dataset.open;
  document.getElementById(modalId).classList.add(isVisible);


};

const actualizarMensaje = async (e) => {
  try {
    let options = {
      method: "PUT",
      headers: {
        "Content-type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        id: e.target.id.value,
        messagetext: e.target.mensagge.value,
      }),
				};
console.log(e.target.id.value)
    let respuesta = await fetch(
      "https://ge679d6c40046b0-test.adb.us-sanjose-1.oraclecloudapps.com/ords/admin/message/message",
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

const agregarMensaje = async (e) => {
    

  try {
    let options = {
      method: "POST",
      headers: {
        "Content-type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        messagetext: e.target.mensagge.value,
       
      }),
    };
    console.log(e.target.mensagge.value);
    let respuesta = await fetch("https://ge679d6c40046b0-test.adb.us-sanjose-1.oraclecloudapps.com/ords/admin/message/message",
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

const eliminarMensaje = async (e) => {
  let isDelete = confirm(
    `Estas seguro de eliminar el mensaje`
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
        
        respuesta = await fetch("https://ge679d6c40046b0-test.adb.us-sanjose-1.oraclecloudapps.com/ords/admin/message/message", options);

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
