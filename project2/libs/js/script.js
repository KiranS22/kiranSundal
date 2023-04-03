// Populating tables functions
const populateEmployeeData = (data) => {
  let content = "";
  for (let i = 0; i < data.length; i++) {
    const employee = data[i];
    content += `<tr>`;
    content += `<td class="listItem" id="${employee.id}"> ${employee.firstName} ${employee.lastName}</td>`;
    content += `<td>${employee.department}</td>`;

    content += `<td><button class="btn btn-dark employee-edit-btn btn-sm" id="${employee.id}">Edit</button> <button class=" btn btn-danger btn-sm employee-del-btn">Delete</button></td>`;
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
    content += `<td><button class="btn btn-dark dep-edit-btn  btn-sm" id="${department.id}">Edit</button> <button class=" btn btn-danger btn-sm dep-del-btn">Delete</button></td>`;
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
    content += `<td><button class="btn btn-dark location-edit-btn btn-sm" id="${location.id}">Edit</button> <button class=" btn btn-danger btn-sm location-del-btn">Delete</button></td>`;
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
      populateEmployeeData(response.data);
    },
    error: (jqXHR, textStatus, errorThrown) => {
      console.log("Error", errorThrown, jqXHR);
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
      if (response.status.name === "ok") {
        let person = response.data.personnel;

        if (person.length > 0) {
          console.log("person", person);
          person = person[0];
          if (modalType === "edit") {
            $("#edit-lastName").val(person.lastName);
            $("#edit-firstName").val(person.firstName);
            $("#edit-email").val(person.email);
            $("#edit-jobTitle").val(person.jobTitle);
            $("#edit-id").val(person.id);
            $("#edit-Department").val(person.departmentID);
          } else {
            $("#lastName").val(person.lastName);
            $("#firstName").val(person.firstName);
            $("#email").val(person.email);
            $("#jobTitle").val(person.jobTitle);
            $("#Department").val(person.departmentID);
          }
        } else {
          alert("Person not found");
        }
      }
    },
    error: (jqXHR, textStatus, errorThrown) => {
      console.log("Error", errorThrown, jqXHR);
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
      console.log("New employee", response);
    },
    error: (jqXHR, textStatus, errorThrown) => {
      console.log("Error", errorThrown, jqXHR);
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
      console.log("updated employee", response);
    },
    error: (jqXHR, textStatus, errorThrown) => {
      console.log("Error", errorThrown, jqXHR);
    },
  });
};
const deleteAnEmployeeById = (id) => {
  console.log("delID in AJAX", id);
  $.ajax({
    type: "POST",
    url: "libs/php/deletePersonnel.php",
    data: { id: id },
    dataType: "json",
    success: (response) => {
      console.log("response from delete query", response);
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

  const CreateDepartment = () => {
    $.ajax({
      type: "POST",
      url: "url",
      data: "data",
      dataType: "json",
      success: (response) => {},
      error: (jqXHR, textStatus, errorThrown) => {
        console.log("Error", errorThrown, jqXHR);
      },
    });
  };
};
const getDepartmentById = () => {
  $.ajax({
    type: "GET",
    url: "url",
    data: "data",
    dataType: "json",
    success: (response) => {},
    error: (jqXHR, textStatus, errorThrown) => {
      console.log("Error", errorThrown, jqXHR);
    },
  });
};
const updateDepartmentInformation = () => {};
const deleteDepartmentsById = () => {
  $.ajax({
    type: "DELETE",
    url: "url",
    data: "data",
    dataType: "dataType",
    success: (response) => {},
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
    let editId = e.target.getAttribute("id");
    // getEmployeeById(editId, "edit");
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
      // deleteAnEmployeeById(delID);
      location.reload();
    }
  });

  $(document).on("click", ".dep-del-btn", (e) => {
    e.stopPropagation();
    e.preventDefault();
    const confirmation = confirm("Are you sure you want to delete this user?");
    let delID = e.target.getAttribute("id");
    if (confirmation) {
      // deleteAnEmployeeById(delID);
      location.reload();
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

  // Submitting the edit Employee Information form
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
});
