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
// show Diffrent modals on the same add-btn
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
// const showCorrectAddForm = () => {
//   if ($("#employee-tab").hasClass("active")) {
//     $("#addForm").modal("show");
//   } else if ($("#department-tab").hasClass("active")) {
//     $("#addDepartmentForm").modal("show");
//   } else if ($("#location-tab").hasClass("active")) {
//     $("#addLocationForm").modal("show");
//   }
// };
// --------------------------------------------
// Populating tables functions
const populateEmployeeData = (data) => {
  let content = "";
  for (let i = 0; i < data.length; i++) {
    const employee = data[i];
    content += `<tr>`;
    content += `<td class="listItem" title="${employee.location}" id="${employee.id}"> ${employee.firstName} ${employee.lastName}  <span class="tooltiptext">${employee.location}</span></td>`;
    content += `<td class="d-none d-sm-block">${employee.department}</td>`;

    content += `<td class="float-right"><button class="btn btn-dark employee-edit-btn btn-sm" id="${employee.id}"><i class="fa-solid fa-pen"></i></button></td>`;

    content += `<td><button class=" btn btn-danger btn-sm employee-del-btn" id="${employee.id}"> <i class="fa-solid fa-trash-can"></i> </button></td>`;
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
    content += `<td ><button class="btn btn-dark dep-edit-btn  btn-sm" id="${department.id}"><i class="fa-solid fa-pen"></i></button></td>`;
    content += `<td><button class=" btn btn-danger btn-sm dep-del-btn" id="${department.id}"><i class="fa-solid fa-trash-can"></i></button></td>`;
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

    content += `<td ><button class="btn btn-dark location-edit-btn btn-sm" id="${location.id}"><i class="fa-solid fa-pen"></i> </button></td> <td><button class=" btn btn-danger btn-sm location-del-btn"  id="${location.id}" ><i class="fa-solid fa-trash-can"></i></button></td>`;
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
            generateToast("Data fetched Sucessfully!", "green");
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

          generateToast("Data fetched successfully", "green");
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
      let code = response.status.code;
      if (code == "200") {
        generateToast("Department added  successfully", "green");
        getAllDepartments();
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
          generateToast("Data fetched successfully", "green");
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
      generateToast("connot delete department");
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
// --------------------------------------------------------------------------

$(document).ready(() => {
  getAllEmployeeInfo();
  getAllDepartments();
  getLocationInformation();
  tabSelector();

  //Opening add forms and hiding search bars functions
  $(".nav-link").click(() => {
    tabSelector();
  });

  $("#add").click((e) => {
    e.preventDefault();
    // showCorrectAddForm();
    if ($("#employee-tab").hasClass("active")) {
      $("#addForm").modal("show");
    } else if ($("#department-tab").hasClass("active")) {
      $("#addDepartmentForm").modal("show");
    } else if ($("#location-tab").hasClass("active")) {
      $("#addLocationForm").modal("show");
    }
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
    getLocationById(editId);
    $("#editLocationForm").modal("show");
  });
  // --------------------------------------------

  // Delete functions
  // employee delete btn in table
  $(document).on("click", ".employee-del-btn", (e) => {
    e.preventDefault();

    $("#employee-del-modal").modal("show");

    let delID = e.target.getAttribute("id");
    $("#confirm-emplee-del-btn").attr("data-emp-id", delID);
  });
  // employee delete btn in confirmation modal
  $("#confirm-emplee-del-btn").click((e) => {
    let empId = e.target.getAttribute("data-emp-id");
    deleteAnEmployeeById(empId);
  });
  // --------------------------------------------
  // department delete btn in table
  $(document).on("click", ".dep-del-btn", (e) => {
    e.preventDefault();
    $("#department-del-modal").modal("show");
    let delID = e.target.getAttribute("id");
    $("#confirm-department-del-btn").attr("data-dep-id", delID);
  });
  // department delete btn in confirmation modal
  $("#confirm-department-del-btn").click((e) => {
    let depId = e.target.getAttribute("data-dep-id");
    deleteDepartmentById(depId);
  });
  // --------------------------------------------

  $(document).on("click", ".location-del-btn", (e) => {
    e.preventDefault();
    $("#location-del-modal").modal("show");
    let delID = e.target.getAttribute("id");
    $("#confirm-location-del-btn").attr("data-loc-id", delID);
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
