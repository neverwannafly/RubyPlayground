import { ServerPreifx, YELLOW_NOTICE, RED_NOTICE } from "../../services/Config.js";
import GetUser from "../../services/GetUser.js";
import Redirect from "../../services/Redirect.js";
import Autocomplete from "../../services/Autocomplete.js";
import IssueNotice from "../../services/IssueNotice.js";

let CreateInterview = {
  render: async () => {
    let view = /*html*/`
      <div class="modal fade" id="createModal" tabindex="-1" role="dialog" aria-labelledby="createModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="createModalLabel">Create Interview</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div class="modal-body">
              <form id="create_interview" action="#" accept-charset="UTF-8" method="post">
      
                <div class="form-group">
                  <label for="interview_title">Title</label>
                  <input class="form-control" type="text" name="interview[title]" id="interview_title">
                </div>
              
                <div class="form-group">
                  <label for="interview_agenda">Agenda</label>
                  <input class="form-control" type="text" name="interview[agenda]" id="interview_agenda">
                </div>
              
                <div class="form-group">
                  <label for="interview_members">Members</label>
                  <input id="find-users" type="text" name="interview[members]">
                </div>
              
                <div class="form-group">
                  <label for="interview_start">Start</label>
                  <input class="form-control" id="dtp_beg" type="datetime-local" name="interview[start]">
                </div>
              
                <div class="form-group">
                  <label for="interview_end">End</label>
                  <input class="form-control" id="dtp_end" type="datetime-local" name="interview[end]">
                </div>
              
                <div class="form-group">
                  <label for="interview_comments">Comments</label>
                  <textarea class="form-control" name="interview[comments]" id="interview_comments"></textarea>
                </div>
              
                <div class="actions">
                  <input type="submit" name="commit" value="Create" class="btn btn-primary btn-block" data-disable-with="Create">
                </div>
              
              </form>
            </div>
          </div>
        </div>
      </div>
    `;
    return view;
  },
  postRender: async () => {
    const createInterview = document.getElementById('create_interview');
    const modal = document.getElementById('createModal');
    createInterview.addEventListener('submit', event => {
      event.preventDefault();
      const url = `${ServerPreifx}/interviews`;
      const userData = GetUser();
      $.ajax({
        url: url,
        data: {
          user_id: userData.userId,
          token: userData.token,
          interview: {
            title: $("#interview_title").val(),
            agenda: $("#interview_agenda").val(),
            members: $("#find-users").val(),
            start: $("#dtp_beg").val(),
            end: $("#dtp_end").val(),
            comments: $("#interview_comments").val(),
          },
        },
        type: "POST",
        success: async data => {
          $(modal).modal('hide');
          await Redirect('/');
          if (data.success) {
            await IssueNotice('Interview added', YELLOW_NOTICE);
          } else {
            await IssueNotice(data.error, RED_NOTICE);
          }
        }
      });
    })
    // makes #find-users an autocomplete field
    Autocomplete('find-users');
  }
}

export default CreateInterview;