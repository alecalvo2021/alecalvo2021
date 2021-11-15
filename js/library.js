const d = document;
openModal = d.querySelector("[data-open]"),
  modal = d.querySelector(".modal"),
  $table = d.querySelector(".table"),
  $form = d.querySelector(".form"),
  $title = d.querySelector(".form-title"),
  $template = d.querySelector("#crud-template").content,
  numeroCubiculos = d.querySelector(".cubiculos"),
  $fragmento = d.createDocumentFragment(),
  isVisible = "is-visible";


/*Funcion que hara visible la ventana modal */
const crearModal =  () => {
 $title.textContent ="Agregar Cubiculo";
 $form.objetivo.value = "";
  $form.capacidad.value = "";
  $form.categoria.value = "";
  $form.nombre.value = "";
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
    eliminarCubiculo(e);
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
      "https://ge679d6c40046b0-test.adb.us-sanjose-1.oraclecloudapps.com/ords/admin/library/library"
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
    data.forEach((cubiculo) => {

      $template.querySelector(".objetivo ").textContent = cubiculo.target;
      $template.querySelector(".capacidad").textContent = cubiculo.capacity;
      $template.querySelector(".categoria").textContent = cubiculo.category_id;
      $template.querySelector(".nombre-sala").textContent = cubiculo.name;
      $template.querySelector(".edit").dataset.target = cubiculo.target;
      $template.querySelector(".edit").dataset.capacidad = cubiculo.capacity;
      $template.querySelector(".edit").dataset.categoria= cubiculo.category_id;
      $template.querySelector(".edit").dataset.name= cubiculo.name;
      $template.querySelector(".edit").dataset.id = cubiculo.id;
      $template.querySelector(".edit i").dataset.target = cubiculo.target;
      $template.querySelector(".edit i").dataset.capacidad = cubiculo.capacity;
      $template.querySelector(".edit i").dataset.categoria= cubiculo.category_id;
      $template.querySelector(".edit i").dataset.name= cubiculo.name;
      $template.querySelector(".edit i").dataset.id = cubiculo.id;
      $template.querySelector(".delete").dataset.id = cubiculo.id;
      $template.querySelector(".delete ").dataset.nombre = cubiculo.name;
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
	numeroCubiculos.textContent=contador;
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
		 agregarCubiculo(e);
  
    } else {
    
		actualizarCubiculo(e);
    }
  }
});

const selecionar = async (e,) => {
  
  $title.textContent = "Editar Cubiculo";
  $form.objetivo.value = e.target.dataset.target;
  $form.capacidad.value =  e.target.dataset.capacidad;
  $form.categoria.value = e.target.dataset.categoria;
  $form.nombre.value = e.target.dataset.name;
  $form.id.value = e.target.dataset.id;
  const modalId = await openModal.dataset.open;
  document.getElementById(modalId).classList.add(isVisible);



};

const actualizarCubiculo = async (e) => {
  try {
    let options = {
      method: "PUT",
      headers: {
        "Content-type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        target: e.target.objetivo.value,
        capacity:e.target.capacidad.value,
        category_id: e.target.categoria.value,
        name:  e.target.nombre.value,
        id: e.target.id.value,
      }),
				};

    let respuesta = await fetch(
      "https://ge679d6c40046b0-test.adb.us-sanjose-1.oraclecloudapps.com/ords/admin/library/library",
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

const agregarCubiculo = async (e) => {

  try {
    let options = {
      method: "POST",
      headers: {
        "Content-type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        target: e.target.objetivo.value,
        capacity:e.target.capacidad.value,
        category_id: e.target.categoria.value,
        name:  e.target.nombre.value,
      }),
    };
    let respuesta = await fetch("https://ge679d6c40046b0-test.adb.us-sanjose-1.oraclecloudapps.com/ords/admin/library/library",
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

const eliminarCubiculo = async (e) => {
  let isDelete = confirm(
    `Estas seguro de eliminar el cubiculo: `
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
        respuesta = await fetch("https://ge679d6c40046b0-test.adb.us-sanjose-1.oraclecloudapps.com/ords/admin/library/library", options);
	
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
