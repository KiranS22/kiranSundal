let searchableData = { staff: [], departments: [], locations: [] };

// -------TOAST NOTIFICATION FUNCTION -------
const generateToast = (text, backgroundColor) => {
  Toastify({
    text: text,
    duration: 3000,
    newWindow: true,
    close: true,
    gravity: "top",
    positionLeft: true,
    backgroundColor: backgroundColor,
  }).showToast();
};
// Toggling which search bar to show  on which tab
const tabSelector = () => {
  if ($("#employee-tab").hasClass("active")) {
    $("#department-search").hide();
    $("#location-search").hide();
    $("#employee-search").show();
  } else if ($("#department-tab").hasClass("active")) {
    $("#location-search").hide();
    $("#employee-search").hide();
    $("#department-search").show();
  } else if ($("#location-tab").hasClass("active")) {
    $("#employee-search").hide();
    $("#department-search").hide();
    $("#location-search").show();
  }
};
// --------------------------------------------------------------------------
// show Diffrent modals on the same add-btn
const showCorrectAddForm = () => {
  if ($("#employee-tab").hasClass("active")) {
    $("#addForm").modal("show");
  } else if ($("#department-tab").hasClass("active")) {
    $("#addDepartmentForm").modal("show");
  } else if ($("#location-tab").hasClass("active")) {
    $("#addLocationForm").modal("show");
  }
};
// --------------------------------------------
// Populating tables functions
const populateEmployeeData = (data) => {
  let content = "";
  for (let i = 0; i < data.length; i++) {
    const employee = data[i];
    content += `<tr>`;
    content += `<td class="listItem" title="${employee.location}" data-bs-toggle="modal" data-bs-target="#readOnlyForm" data-id="${employee.id}"> ${employee.firstName} ${employee.lastName}  <span class="tooltiptext">${employee.location}</span></td>`;
    content += `<td class="d-none d-sm-block">${employee.department}</td>`;

    content += `<td class="w-17"><div class="d-flex justify-content-end"><button class="btn btn-dark btn-sm" data-bs-toggle="modal" data-bs-target="#editForm" employee-edit-btn " data-id="${employee.id}"><i class="fa-solid fa-pen"></i></button></div></td>`;

    content += `<td class="w-12"><div class="d-flex justify-content-end">
    <button class="btn btn-danger btn-sm employee-del-btn" data-bs-toggle="modal" data-bs-target="#employee-del-modal" data-id="${employee.id}" data-name="${employee.firstName} ${employee.lastName}"> <i class="fa-solid fa-trash-can"></i> </button></div></td>`;
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
    content += `<td  id="${department.id}"> ${department.name}</td>`;
    content += `<td class="d-none d-sm-block">${department.location}</td>`;
    content += `<td class="w-17"><div class="d-flex justify-content-end"><button class="  btn btn-dark dep-edit-btn  btn-sm" data-id="${department.id}"  data-bs-toggle="modal" data-bs-target="#editDepartmentForm"><i class="fa-solid fa-pen"></i></button></div></td>`;
    content += `<td class="w-12"><div class="d-flex justify-content-end"><button class=" btn btn-danger btn-sm dep-del-btn" data-id="${department.id}"><i class="fa-solid fa-trash-can"></i></button></div></td>`;
    content += `</tr>`;
  }
  $("#departmentsList").html(content);
};
const populateLocationData = (data) => {
  let content = "";
  for (let i = 0; i < data.length; i++) {
    const location = data[i];
    content += `<tr>`;
    content += `<td  id="${location.id}"> ${location.name}</td>`;

    content += `<td class="w-17"><div class="d-flex justify-content-end"><button class="  btn btn-dark location-edit-btn btn-sm" data-id="${location.id}" data-bs-toggle="modal" data-bs-target="#editLocationForm"><i class="fa-solid fa-pen"></i> </button></div></td> <td class="w-12"><div class="d-flex justify-content-end"><button class=" btn btn-danger btn-sm location-del-btn" data-id="${location.id}"><i class="fa-solid fa-trash-can"></i></button></div></td>`;
    content += `</tr>`;
  }
  $("#locationsList").html(content);
};
// -----------------------------------------

// Employee CREATE, READ UPDATE & DELETE functions
const getAllEmployeeInfo = () => {
  $.ajax({
    type: "POST",
    url: "libs/php/getAll.php",
    dataType: "json",
    success: (response) => {
      let code = response.status.code;
      if (code == "200") {
        searchableData["staff"] = response.data;
        populateEmployeeData(response.data);
      }
    },
    error: () => {
      generateToast("Could load employee data", "red");
    },
  });
};

const getEmployeeById = (id, modalType) => {
  $.ajax({
    type: "POST",
    url: "libs/php/getPersonnelByID.php",
    data: { id: Number(id) },
    dataType: "json",
    success: (response) => {
      let code = response.status.code;
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
            getAllEmployeeInfo();
          } else {
            $("#lastName").val(person.lastName);
            $("#firstName").val(person.firstName);
            $("#email").val(person.email);
            $("#jobTitle").val(person.jobTitle);
            $("#Department").val(person.departmentID);
          }
        } else {
          generateToast("Personnel Not Found!", "red");
        }
      }
    },
    error: () => {
      generateToast("Something went wrong !", "red");
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
      let code = response.status.code;
      if (code == "200") {
        generateToast("Employee Added  Sucessfully!", "green");
        getAllEmployeeInfo();
      } else if (code == "500") {
        generateToast("Invalid data added", "red");
      } else if (code == "1062") {
        generateToast("These credentials are already taken", "red");
      }
    },
    error: () => {
      generateToast("Could not add employee", "red");
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
      let code = response.status.code;
      if ((code = "200")) {
        generateToast("Employee information updated  successfully!", "green");
        getAllEmployeeInfo();
      }
    },
    error: () => {
      generateToast("Could not update employee!", "red");
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
      let code = response.status.code;
      if (code == "200") {
        generateToast("Employee Deleted Sucessfully!", "green");
        $("#employee-del-modal").modal("hide");
        getAllEmployeeInfo();
      }
    },
    error: () => {
      generateToast("Could not delete Employee!", "red");
    },
  });
};
// -----------------------------------------

// Department CREATE, READ UPDATE & DELETE functions
const getAllDepartments = () => {
  $.ajax({
    type: "POST",
    url: "libs/php/getAllDepartments.php",
    data: "",
    dataType: "json",
    success: (response) => {
      let code = response.status.code;
      searchableData["departments"] = response.data;
      if (code == "200") {
        populateDepartmentData(response.data);
        populateDepartmentDropdownForEmployeeData(response.data);
      }
    },
    error: () => {
      generateToast("Could not load department data", "red");
    },
  });
};
const getDepartmentById = (id) => {
  $.ajax({
    type: "POST",
    url: "libs/php/getDepartmentByID.php",
    data: { id: Number(id) },
    dataType: "json",
    success: (response) => {
      let code = response.status.code;
      if (code === "200") {
        let department = response.data;

        if (department.length > 0) {
          department = department[0];

          $("#edit-Department-name").val(department.name);
          $("#edit-dep-id").val(department.id);
          $("#edit-department-location").val(department.locationID);
        } else {
          generateToast("Could not load departments", "red");
        }
      }
    },
    error: () => {
      generateToast("Could not load departments", "red");
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
      console.log("create department course", response);
      let code = response.status.code;

      if (code == "200") {
        generateToast("Department added  successfully", "green");
        getAllDepartments();
      } else if (code == "500") {
        generateToast("Invalid data added", "red");
      } else if (code == "1062") {
        generateToast("These credentials are already taken", "red");
      }
    },
    error: () => {
      generateToast("Could not add department", "red");
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
      let code = response.status.code;
      if (code == "200") {
        generateToast("Department updated  successfully!", "green");
        getAllDepartments();
      }
    },
    error: () => {
      generateToast("Could not update department", "red");
    },
  });
};
const deleteDepartmentById = (id) => {
  $.ajax({
    type: "POST",
    url: "libs/php/deleteDepartmentByID.php",
    data: { id: id },
    dataType: "json",
    success: (response) => {
      let code = response.status.code;
      if (code == "200") {
        generateToast("Department deleted successfully", "green");
        $("#department-del-modal").modal("hide");
        getAllDepartments();
      }

      if (code == "500") {
        $("#department-del-modal").modal("hide");
        generateToast(
          "Sorry, you cannot delete this department as employees are assigned to it",
          "red"
        );
        getAllDepartments();
      }
    },
    error: () => {
      generateToast("Could not delete department");
    },
  });
};
// ----------------------------------------

// Location CREATE, READ UPDATE & DELETE functions
const getLocationInformation = () => {
  $.ajax({
    type: "POST",
    url: "libs/php/getLocation.php",
    data: "",
    dataType: "json",
    success: (response) => {
      searchableData["locations"] = response.data;
      populateLocationData(response.data);
      populateLocationDropdownForDepartment(response.data);
    },
    error: () => {
      generateToast("Could not load location data", "red");
    },
  });
};

const getLocationById = (id) => {
  $.ajax({
    type: "POST",
    url: "libs/php/getLocationByID.php",
    data: { id: Number(id) },
    dataType: "json",
    success: (response) => {
      let code = response.status.code;
      if (code === "200") {
        let location = response.data;

        if (location.length > 0) {
          location = location[0];

          $("#edit-location-name").val(location.name);
          $("#edit-location-id").val(location.id);
          getLocationInformation();
        } else {
          generateToast("Could not load locations", "red");
        }
      }
    },
    error: () => {
      generateToast("Could not load locations", "red");
    },
  });
};
const createLocation = (name) => {
  $.ajax({
    type: "POST",
    url: "libs/php/insertLocation.php",
    data: { name },
    dataType: "json",
    success: (response) => {
      let code = response.status.code;
      if (code == "200") {
        generateToast("Location added  successfully", "green");
        getLocationInformation();
      } else if (code == "500") {
        generateToast("Invalid data added", "red");
      } else if (code == "1062") {
        generateToast("These credentials are already taken", "red");
      }
    },
    error: () => {
      generateToast("cannot add location", "red");
    },
  });
};

const updateLocationInformation = (name, id) => {
  $.ajax({
    type: "POST",
    url: "libs/php/updateLocationByID.php",
    data: { name, id },
    dataType: "json",
    success: (response) => {
      let code = response.status.code;
      if (code == "200") {
        getLocationInformation();
        generateToast("Location Updated Successfully!", "green");
      } else if (code == "500") {
        generateToast("Invalid data added", "red");
      } else if (code == "1062") {
        generateToast("These credentials are already taken", "red");
      }
    },
    error: () => {
      generateToast("Could not update location", "red");
    },
  });
};

const deleteLocationById = (id) => {
  $.ajax({
    type: "POST",
    url: "libs/php/deleteLocationById.php",
    data: { id: id },
    dataType: "json",
    success: (response) => {
      let code = response.status.code;
      if (code == "200") {
        generateToast("Location deleted successfully", "green");
        $("#location-del-modal").modal("hide");
        getLocationInformation();
      }
      if (code == "500") {
        generateToast(
          "Sorry, you cannot delete this location as it is assigned to departments",
          "red"
        );
      }
    },
    error: () => {
      generateToast("connot delete department", "red");
    },
  });
};
const getEmployeeCountByDepartment = (depId) => {
  $.ajax({
    type: "POST",
    url: "libs/php/countEmployeesByDepartment.php",
    data: { id: depId },
    dataType: "json",
    success: (response) => {
      let departmentCount = response.data.department[0].departmentCount;
      let departmentName = response.data.department[0].departmentName;
      if (departmentCount > 0) {
        generateToast(
          ` Sorry, you cannot delete ${departmentName} as there are ${departmentCount} employees are assigned to it`,
          "red"
        );
      } else {
        $("#confirm-department-del-btn").attr("data-dep-id", depId);
        $("#department-del-modal .modal-body p").html(
          `Are you sure you want to delete ${departmentName}? This cannot be undone`
        );
        $("#department-del-modal").modal("show");
      }
    },
    error: () => {
      generateToast("Something went wromg", "red");
    },
  });
};

const countDepartmentByLocation = (locId) => {
  $.ajax({
    type: "POST",
    url: "libs/php/countDepartmentByLocation.php",
    data: { id: locId },
    dataType: "json",
    success: (response) => {
      let locationCount = response.data.location[0].locationCount;
      let locationName = response.data.location[0].locationName;
      if (locationCount > 0) {
        generateToast(
          ` Sorry, you cannot delete ${locationName} as there are ${locationCount} departments are assigned to it`,
          "red"
        );
      } else {
        $("#confirm-location-del-btn").attr("data-loc-id", locId);
        $("#location-del-modal .modal-body p").html(
          `Are you sure you want to delete ${locationName}? This cannot be undone`
        );
        $("#location-del-modal").modal("show");
      }
    },
    error: () => {
      generateToast("Something went wromg", "red");
    },
  });
};

// --------------------------------------

// Functions for allowing searching in tables
const searchPersonnel = (value) => {
  let personnelData = searchableData["staff"].filter(
    (data) =>
      data.firstName.toLowerCase().includes(value.toLowerCase()) ||
      data.lastName.toLowerCase().includes(value.toLowerCase()) ||
      data.department.toLowerCase().includes(value.toLowerCase())
  );

  populateEmployeeData(personnelData);
};

const searchDepartments = (value) => {
  let departmentData = searchableData["departments"].filter(
    (data) =>
      data.location.toLowerCase().includes(value.toLowerCase()) ||
      data.name.toLowerCase().includes(value.toLowerCase())
  );

  populateDepartmentData(departmentData);
};

const searchLocations = (value) => {
  let locationData = searchableData["locations"].filter((data) =>
    data.name.toLowerCase().includes(value)
  );

  populateLocationData(locationData);
};

$(document).ready(() => {
  getAllEmployeeInfo();
  getAllDepartments();
  getLocationInformation();
  tabSelector();

  //Opening add forms and hiding search bars functions
  $(".nav-link").click(() => {
    tabSelector();
  });

  $("#add-button").on("click", (e) => {
    e.preventDefault();
    showCorrectAddForm();
  });
  // ------------------------------------------------

  // Read more Employee info
  $("#readOnlyForm").on("show.bs.modal", (e) => {
    getEmployeeById($(e.relatedTarget).attr("data-id"), "read");
  });
  // ------------------------------------------------
  // Edit form Functions
  $("#editForm").on("show.bs.modal", (e) => {
    getEmployeeById($(e.relatedTarget).attr("data-id"), "edit");
  });
  $("#editDepartmentForm").on("show.bs.modal", (e) => {
    getDepartmentById($(e.relatedTarget).attr("data-id"));
  });

  $("#editLocationForm").on("show.bs.modal", (e) => {
    getLocationById($(e.relatedTarget).attr("data-id"));
  });
  // --------------------------------------------

  // Delete functions
  // employee delete btn in table
  // employee delete btn in table
  $("#employee-del-modal").on("show.bs.modal", (e) => {
    let employeeName = $(e.relatedTarget).attr("data-name");
    $("#employee-del-modal .modal-body p").html(
      `Are you sure you want to delete ${employeeName}? This cannot be undone`
    );

    let delID = $(e.relatedTarget).attr("data-id");
    $("#confirm-employee-del-btn").attr("data-emp-id", delID);
  });

  // employee delete btn in confirmation modal
  $("#confirm-employee-del-btn").click((e) => {
    let empId = e.target.getAttribute("data-emp-id");
    deleteAnEmployeeById(empId);
  });
  // --------------------------------------------
  // department delete btn in table
  $(document).on("click", ".dep-del-btn", (e) => {
    e.preventDefault();
    let delID = e.target.getAttribute("data-id");
    getEmployeeCountByDepartment(delID);
  });
  // department delete btn in confirmation modal
  $("#confirm-department-del-btn").click((e) => {
    let depId = e.target.getAttribute("data-dep-id");
    deleteDepartmentById(depId);
  });
  // --------------------------------------------

  $(document).on("click", ".location-del-btn", (e) => {
    e.preventDefault();
    let delID = e.target.getAttribute("data-id");
    countDepartmentByLocation(delID);
  });
  // department delete btn in confirmation modal
  $("#confirm-location-del-btn").click((e) => {
    let locId = e.target.getAttribute("data-loc-id");
    deleteLocationById(locId);
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
    $("#addForm").modal("hide");
  });

  // -------------------------------------------------

  // Submitting the Add new department form
  $("#addDepartmentForm").on("submit", (e) => {
    e.preventDefault();
    createDepartment(
      $("#add-Department-name").val(),
      $("#add-department-location").val()
    );
    $("#addDepartmentForm").modal("hide");
  });

  // -------------------------------------------------

  // Submitting the Add new Location form
  $("#addLocationForm").on("submit", (e) => {
    e.preventDefault();
    createLocation($("#add-location-name").val());
    $("#addLocationForm").modal("hide");
  });

  // -------------------------------------------------
  // Submitting employee edit form
  $("#editForm").on("submit", (e) => {
    e.preventDefault();
    $("#editForm").modal("hide");
    updateEmployeeInformation(
      $("#edit-firstName").val(),
      $("#edit-lastName").val(),
      $("#edit-jobTitle").val(),
      $("#edit-email").val(),
      $("#edit-Department").val(),
      $("#edit-id").val()
    );
  });
  //-----------------------------------

  // Submitting department edit form
  $("#editDepartmentForm").on("submit", (e) => {
    e.preventDefault();

    updateDepartmentInformation(
      $("#edit-Department-name").val(),
      $("#edit-department-location").val(),
      $("#edit-dep-id").val()
    );
    $("#editDepartmentForm").modal("hide");
  });
  //-----------------------------------
  // Submitting edit location form
  $("#editLocationForm").on("submit", (e) => {
    e.preventDefault();

    updateLocationInformation(
      $("#edit-location-name").val(),
      $("#edit-location-id").val()
    );

    $("#editLocationForm").modal("hide");
  });
  // --------------------------------------
  $("#addForm").on("hidden.bs.modal", () => {
    $("#addEmployeeForm")[0].reset();
  });

  $("#addDepartmentForm").on("hidden.bs.modal", () => {
    $("#createDepForm")[0].reset();
  });

  $("#addLocationForm").on("hidden.bs.modal", () => {
    $("#createLocForm")[0].reset();
  });

  // Searchbar functions
  $("#employee-search").keyup((e) => {
    searchPersonnel(e.target.value);
    if (e.target.value == "") {
      getAllEmployeeInfo();
    }
  });

  $("#department-search").keyup((e) => {
    searchDepartments(e.target.value);
    if (e.target.value == "") {
      getAllDepartments();
    }
  });

  $("#location-search").keyup((e) => {
    searchLocations(e.target.value);
    if (e.target.value == "") {
      getLocationInformation();
    }
  });
});
// -----------------------------------------
