// -------TOAST NOTIFICATION VARIABLES -------

const dataLoadedSuccessfullyMsg = Toastify({
  text: "Employee Added Sucessfully",
  duration: 3000,
  newWindow: true,
  close: true,
  gravity: "top",
  positionLeft: true,
  backgroundColor: "green",
});
// Sucessfull Employee  CRUD notifications
const employeeAddedSuccessfullyMsg = Toastify({
  text: "Employee Added Sucessfully",
  duration: 3000,
  newWindow: true,
  close: true,
  gravity: "top",
  positionLeft: true,
  backgroundColor: "green",
});

const employeeUpdatedSuccessfullyMsg = Toastify({
  text: "Employee Updated Sucessfully",
  duration: 3000,
  newWindow: true,
  close: true,
  gravity: "top",
  positionLeft: true,
  backgroundColor: "green",
});

const employeeDeletedSuccessfullyMsg = Toastify({
  text: "Employee Deleted Sucessfully",
  duration: 3000,
  newWindow: true,
  close: true,
  gravity: "top",
  positionLeft: true,
  backgroundColor: "green",
});
// ----------------------------------------------------

// failed Employee CRUD opretaions
const couldNotAddEmployeeMsg = Toastify({
  text: "Could Not Add Employee",
  duration: 3000,
  newWindow: true,
  close: true,
  gravity: "top",
  positionLeft: true,
  backgroundColor: "red",
});

const couldNotUpdateEmployeeMsg = Toastify({
  text: "Could Not Update Employee",
  duration: 3000,
  newWindow: true,
  close: true,
  gravity: "top",
  positionLeft: true,
  backgroundColor: "red",
});

const couldNotDeleteEmployeeMsg = Toastify({
  text: "Could Not Add Employee",
  duration: 3000,
  newWindow: true,
  close: true,
  gravity: "top",
  positionLeft: true,
  backgroundColor: "red",
});
// ------------------------------------------------------

// Successfull department CRUD operations
const departmentAddedSuccessfullyMsg = Toastify({
  text: "Department Added Sucessfully",
  duration: 3000,
  newWindow: true,
  close: true,
  gravity: "top",
  positionLeft: true,
  backgroundColor: "green",
});

const departmentUpdatedSuccessfullyMsg = Toastify({
  text: "Department Updated Sucessfully",
  duration: 3000,
  newWindow: true,
  close: true,
  gravity: "top",
  positionLeft: true,
  backgroundColor: "green",
});

const departmentDeletedSuccessfullyMsg = Toastify({
  text: "Department Deleted Sucessfully",
  duration: 3000,
  newWindow: true,
  close: true,
  gravity: "top",
  positionLeft: true,
  backgroundColor: "green",
});
// ----------------------------------------------------

// failed Department CRUD opretaions
const couldNotAddDepartmentMsg = Toastify({
  text: "Could Not Add Department",
  duration: 3000,
  newWindow: true,
  close: true,
  gravity: "top",
  positionLeft: true,
  backgroundColor: "red",
});
const couldNotUpdateDepartmentMsg = Toastify({
  text: "Could not update department",
  duration: 3000,
  newWindow: true,
  close: true,
  gravity: "top",
  positionLeft: true,
  backgroundColor: "red",
});

const cannotDeleteDepartmentDueToDependenciesMsg = Toastify({
  text: "Could not delete this department as there are employees in it",
  duration: 3000,
  newWindow: true,
  close: true,
  gravity: "top",
  positionLeft: true,
  backgroundColor: "red",
});
// ----------------------------------
// Successfull location CRUD operations
const locationAddedSuccessfullyMsg = Toastify({
  text: "Location Added Sucessfully",
  duration: 3000,
  newWindow: true,
  close: true,
  gravity: "top",
  positionLeft: true,
  backgroundColor: "green",
});

const locationUpdatedSuccessfullyMsg = Toastify({
  text: "Location Updated Sucessfully",
  duration: 3000,
  newWindow: true,
  close: true,
  gravity: "top",
  positionLeft: true,
  backgroundColor: "green",
});

const locationDeletedSuccessfullyMsg = Toastify({
  text: "Location Deleted Sucessfully",
  duration: 3000,
  newWindow: true,
  close: true,
  gravity: "top",
  positionLeft: true,
  backgroundColor: "green",
});
// ----------------------------------------------------

// failed location CRUD opretaions
const couldNotAddLocationMsg = Toastify({
  text: "Could Not Add location",
  duration: 3000,
  newWindow: true,
  close: true,
  gravity: "top",
  positionLeft: true,
  backgroundColor: "red",
});
const couldNotUpdateLocationMsg = Toastify({
  text: "Could Not Update Location",
  duration: 3000,
  newWindow: true,
  close: true,
  gravity: "top",
  positionLeft: true,
  backgroundColor: "red",
});

const cannotDeleteLocationDueToDependenciesMsg = Toastify({
  text: "Could not delete this location as it has departments asigned to it",
  duration: 3000,
  newWindow: true,
  close: true,
  gravity: "top",
  positionLeft: true,
  backgroundColor: "red",
});
// -------------------------------------------------------------
// general err messages
const cannotLoadData = Toastify({
  text: "Could not load data",
  duration: 3000,
  newWindow: true,
  close: true,
  gravity: "top",
  positionLeft: true,
  backgroundColor: "red",
});

const personelNotFound = Toastify({
  text: "Personnel Not Found",
  duration: 3000,
  newWindow: true,
  close: true,
  gravity: "top",
  positionLeft: true,
  backgroundColor: "red",
});
const somethingWentWrong = Toastify({
  text: "So",
  duration: 3000,
  newWindow: true,
  close: true,
  gravity: "top",
  positionLeft: true,
  backgroundColor: "red",
});

// -------ENXD OF TOAST NOTIFICATION VARIABLES -------
// Populating tables functions
const populateEmployeeData = (data) => {
  let content = "";
  for (let i = 0; i < data.length; i++) {
    const employee = data[i];
    content += `<tr>`;
    content += `<td class="listItem" id="${employee.id}"> ${employee.firstName} ${employee.lastName}</td>`;
    content += `<td>${employee.department}</td>`;

    content += `<td><button class="btn btn-dark employee-edit-btn btn-sm" id="${employee.id}">Edit</button> <button class=" btn btn-danger btn-sm employee-del-btn" id="${employee.id}">Delete</button></td>`;
    content += `</tr>`;
  }
  $("#employeesList").html(content);
};
const populateDepartmentDropdownForEmployeeData = (data) => {
  let content = "<option value='' >Choose Department</option>";
  for (let i = 0; i < data.length; i++) {
    const dep = data[i];
    content += `<option value="${dep.id}">${dep.name}</option>`;
  }
  $("#add-Department").html(content);
  $("#edit-Department").html(content);
  $("#Department").html(content);
};

const populateLocationDropdownForDepartment = (data) => {
  console.log("locationDropdownData", data);
  let content = "<option value='' >Choose Locatiom </option>";
  for (let i = 0; i < data.length; i++) {
    const location = data[i];
    content += `<option value="${location.id}">${location.name}</option>`;
  }
  $("#add-department-location").html(content);
  $("#edit-department-location").html(content);
};
const populateDepartmentData = (data) => {
  let content = "";
  for (let i = 0; i < data.length; i++) {
    const department = data[i];
    content += `<tr>`;
    content += `<td class="listItem" id="${department.id}"> ${department.name}</td>`;
    content += `<td>${department.location}</td>`;
    content += `<td><button class="btn btn-dark dep-edit-btn  btn-sm" id="${department.id}">Edit</button> <button class=" btn btn-danger btn-sm dep-del-btn" id="${department.id}">Delete</button></td>`;
    content += `</tr>`;
  }
  $("#departmentsList").html(content);
};
const populateLocationData = (data) => {
  let content = "";
  for (let i = 0; i < data.length; i++) {
    const location = data[i];
    content += `<tr>`;
    content += `<td class="listItem" id="${location.id}"> ${location.name}</td>`;
    content += `<td>${location.id}</td>`;
    content += `<td><button class="btn btn-dark location-edit-btn btn-sm" id="${location.id}">Edit</button> <button class=" btn btn-danger btn-sm location-del-btn"  id="${location.id}" >Delete</button></td>`;
    content += `</tr>`;
  }
  $("#locationsList").html(content);
};
// -----------------------------------------

// Employee CREATE, READ UPDATE & DELETE functions
const getAllEmployeeInfo = () => {
  $.ajax({
    type: "GET",
    url: "libs/php/getAll.php",
    data: "data",
    dataType: "json",
    success: (response) => {
      console.log(response);
      const code = response.status.code;
      if (code == "200") {
        populateEmployeeData(response.data);
        dataLoadedSuccessfullyMsg.showToast();
      }
    },
    error: (jqXHR, textStatus, errorThrown) => {
      cannotLoadData.showToast();
    },
  });
};

const getEmployeeById = (id, modalType) => {
  console.log(modalType, id);
  $.ajax({
    type: "GET",
    url: "libs/php/getPersonnelByID.php",
    data: { id: Number(id) },
    dataType: "json",
    success: (response) => {
      const code = response.status.code;
      if (code == "200") {
        let person = response.data.personnel;

        if (person.length > 0) {
          person = person[0];
          if (modalType === "edit") {
            $("#edit-lastName").val(person.lastName);
            $("#edit-firstName").val(person.firstName);
            $("#edit-email").val(person.email);
            $("#edit-jobTitle").val(person.jobTitle);
            $("#edit-id").val(person.id);
            $("#edit-Department").val(person.departmentID);
            employeeUpdatedSuccessfullyMsg.showToast();
            getAllEmployeeInfo(response.data);
          } else {
            $("#lastName").val(person.lastName);
            $("#firstName").val(person.firstName);
            $("#email").val(person.email);
            $("#jobTitle").val(person.jobTitle);
            $("#Department").val(person.departmentID);
          }
        } else {
          personelNotFound.showToast();
        }
      }
    },
    error: (jqXHR, textStatus, errorThrown) => {
      somethingWentWrong.showToast();
    },
  });
};
const createEmployee = (firstName, lastName, jobTitle, email, departmentID) => {
  $.ajax({
    type: "POST",
    url: "libs/php/insertPersonnel.php",
    data: { firstName, lastName, jobTitle, email, departmentID },
    dataType: "json",
    success: (response) => {
      const code = response.status.code;
      if (code == "200") {
        employeeAddedSuccessfullyMsg.showToast();
        getAllEmployeeInfo(response.data);
      }
    },
    error: (jqXHR, textStatus, errorThrown) => {
      couldNotAddEmployeeMsg.showToast();
    },
  });
};
const updateEmployeeInformation = (
  firstName,
  lastName,
  jobTitle,
  email,
  departmentID,
  id
) => {
  $.ajax({
    type: "POST",
    url: "libs/php/updatePersonnel.php",
    data: { firstName, lastName, jobTitle, email, departmentID, id },
    dataType: "json",
    success: (response) => {
      const code = response.status.code;
      if ((code = "200")) {
        employeeUpdatedSuccessfullyMsg.showToast();
        getAllEmployeeInfo(response.data);
      }
    },
    error: (jqXHR, textStatus, errorThrown) => {
      couldNotUpdateEmployeeMsg.showToast();
    },
  });
};
const deleteAnEmployeeById = (id) => {
  $.ajax({
    type: "POST",
    url: "libs/php/deletePersonnel.php",
    data: { id: id },
    dataType: "json",
    success: (response) => {
      const code = response.status.code;
      if (code == "200") {
        employeeDeletedSuccessfullyMsg.showToast();
        getAllEmployeeInfo(response.data);
      }
    },
    error: (jqXHR, textStatus, errorThrown) => {
      console.log("Error", errorThrown, jqXHR);
    },
  });
};
// -----------------------------------------

// Department CREATE, READ UPDATE & DELETE functions
const getAllDepartments = () => {
  $.ajax({
    type: "GET",
    url: "libs/php/getAllDepartments.php",
    data: "",
    dataType: "json",
    success: (response) => {
      console.log("All Departents", response);
      populateDepartmentData(response.data);
      populateDepartmentDropdownForEmployeeData(response.data);
    },
    error: (jqXHR, textStatus, errorThrown) => {
      console.log("Error", errorThrown, jqXHR);
    },
  });
};
const getDepartmentById = (id) => {
  console.log(id);
  $.ajax({
    type: "GET",
    url: "libs/php/getDepartmentByID.php",
    data: { id: Number(id) },
    dataType: "json",
    success: (response) => {
      if (response.status.name === "ok") {
        console.log("getDepartmentById", response);
        let department = response.data;

        if (department.length > 0) {
          department = department[0];

          $("#edit-Department-name").val(department.name);
          $("#edit-dep-id").val(department.id);
        } else {
          alert("Could not load departments ");
        }
      }
    },
    error: (jqXHR, textStatus, errorThrown) => {
      console.log("Error", errorThrown, jqXHR);
    },
  });
};
const createDepartment = (name, locationID) => {
  $.ajax({
    type: "POST",
    url: "libs/php/insertDepartment.php",
    data: { name, locationID },
    dataType: "json",
    success: (response) => {
      console.log("New department", response);
    },
    error: (jqXHR, textStatus, errorThrown) => {
      console.log("Error", errorThrown, jqXHR);
    },
  });
};
const updateDepartmentInformation = (departmentName, locationID, id) => {
  $.ajax({
    type: "POST",
    url: "libs/php/updateDepartment.php",
    data: { departmentName, locationID, id },
    dataType: "json",
    success: (response) => {
      console.log("updated employee", response);
    },
    error: (jqXHR, textStatus, errorThrown) => {
      console.log("Error", errorThrown, jqXHR);
    },
  });
};
const deleteDepartmentsById = (id) => {
  console.log("delete func running");
  $.ajax({
    type: "POST",
    url: "libs/php/deleteDepartmentByID.php",
    data: { id: id },
    dataType: "json",
    success: (response) => {
      console.log("response from delete query", response);
      if (response.status.code == "500") {
        //TosterLibrarry.alert('Cannot delete department. Employees exist ')
      }
    },
    error: (jqXHR, textStatus, errorThrown) => {
      console.log("Error", errorThrown, jqXHR);
    },
  });
};
// ----------------------------------------

// Location CREATE, READ UPDATE & DELETE functions
const getLocationInformation = () => {
  $.ajax({
    type: "GET",
    url: "libs/php/getLocation.php",
    data: "",
    dataType: "json",
    success: function (response) {
      console.log("location Response", response);
      populateLocationData(response.data);
      populateLocationDropdownForDepartment(response.data);
    },
    error: (jqXHR, textStatus, errorThrown) => {
      console.log("Error", errorThrown, jqXHR);
    },
  });
};

const getLocationById = () => {};
const createLocation = () => {};
const updateLocationInformation = () => {};
const deleteLocation = () => {};
// --------------------------------------

$(document).ready(() => {
  getAllEmployeeInfo();
  getAllDepartments();
  getLocationInformation();

  //Opening add form functions
  $("#employee-add-btn").click((e) => {
    $("#addForm").modal("show");
  });

  $("#department-add-btn").click((e) => {
    $("#addDepartmentForm").modal("show");
  });
  $("#location-add-btn").click((e) => {
    $("#addLocationForm").modal("show");
  });
  // ------------------------------------------------

  // Read more Employee info

  $(document).on("click", ".listItem", (e) => {
    let personId = e.target.getAttribute("id");
    getEmployeeById(personId, "read");
    $("#readOnlyForm").modal("show");
  });
  // ------------------------------------------------
  // Edit form Functions
  $(document).on("click", ".employee-edit-btn", (e) => {
    e.stopPropagation();
    let editId = e.target.getAttribute("id");
    getEmployeeById(editId, "edit");
    $("#editForm").modal("show");
  });
  $(document).on("click", ".dep-edit-btn", (e) => {
    e.stopPropagation();
    let depId = e.target.getAttribute("id");
    getDepartmentById(depId);
    $("#editDepartmentForm").modal("show");
  });
  $(document).on("click", ".location-edit-btn", (e) => {
    e.stopPropagation();
    let editId = e.target.getAttribute("id");
    // getEmployeeById(editId, "edit");
    $("#editLocationForm").modal("show");
  });
  // --------------------------------------------

  // Delete functions

  $(document).on("click", ".employee-del-btn", (e) => {
    e.stopPropagation();
    e.preventDefault();
    const confirmation = confirm("Are you sure you want to delete this user?");
    let delID = e.target.getAttribute("id");
    if (confirmation) {
      deleteAnEmployeeById(delID);
      location.reload();
    }
  });

  $(document).on("click", ".dep-del-btn", (e) => {
    e.stopPropagation();
    e.preventDefault();
    let delID = e.target.getAttribute("id");
    console.log("delTarget", delID);
    const confirmation = confirm(
      "Are you sure you want to delete this department? This will impact on other tables "
    );
    if (confirmation) {
      deleteDepartmentsById(delID);
    }
  });

  $(document).on("click", ".location-del-btn", (e) => {
    e.stopPropagation();
    e.preventDefault();
    const confirmation = confirm("Are you sure you want to delete this user?");
    let delID = e.target.getAttribute("id");
    if (confirmation) {
      // deleteAnEmployeeById(delID);
      location.reload();
    }
  });
  // --------------------------------------------------
  // FORM SUBMITTIONS
  // Submitting the Add new staff form
  $("#addForm").on("submit", (e) => {
    e.preventDefault();
    createEmployee(
      $("#add-firstName").val(),
      $("#add-lastName").val(),
      $("#add-jobTitle").val(),
      $("#add-email").val(),
      $("#add-Department").val()
    );
    location.reload();
  });

  // -------------------------------------------------

  // Submitting the Add new department form
  $("#addDepartmentForm").on("submit", (e) => {
    e.preventDefault();
    createDepartment(
      $("#add-Department-name").val(),
      $("#add-department-location").val()
    );
  });

  // -------------------------------------------------

  // Submitting employee edit form
  $("#editForm").on("submit", (e) => {
    e.preventDefault();
    const confirmation = confirm("Are you sure you want to update this user?");
    if (confirmation) {
      updateEmployeeInformation(
        $("#edit-firstName").val(),
        $("#edit-lastName").val(),
        $("#edit-jobTitle").val(),
        $("#edit-email").val(),
        $("#edit-Department").val(),
        $("#edit-id").val()
      );
    }
    $("#editForm").modal("hide");
  });
  //-----------------------------------

  // Submitting department edit form
  $("#editDepartmentForm").on("submit", (e) => {
    e.preventDefault();
    const confirmation = confirm(
      "Are you sure you want to update this department?"
    );
    if (confirmation) {
      console.log("dep location ID", $("#edit-department-location").val());
      updateDepartmentInformation(
        $("#edit-Department-name").val(),
        $("#edit-department-location").val(),
        $("#edit-dep-id").val()
      );
    }
    $("#editDepartmentForm").modal("hide");
  });
  //-----------------------------------
});
