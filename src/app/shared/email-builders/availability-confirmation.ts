
export function buildAvailabilityConfirmationEmail(firstname: string, availability: string, matchDate: Date, appURL: string): string {
    let email = `<body width="100%%" style="margin: 0; padding: 0 !important; mso-line-height-rule: exactly; background-color: #FFFFFF;">
    <div valign="middle" class="hero" style="background-size: cover; height: 400px;"> 
      <div class="text" style="padding: 0 3em; text-align: center;"> 
        <h2>Salut ,</h2> 
        <h3>${firstname} a répondu ${availability} pour le match du ${matchDate.toLocaleDateString('fr-FR', {day: 'numeric', month: 'long', year: 'numeric'})}</h3>
      </div>
      <div valign="middle" class="hero" style="background-size: cover; height: 400px;">
        <div class="text" style="padding: 0 3em; text-align: center;">
          <p>
            <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" style=\"border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: auto;\">
              <tbody>
                <tr>
                  <td style=\"font-family: sans-serif; font-size: 14px; vertical-align: top; background-color: #3498db; border-radius: 5px; text-align: center;\"> 
                    <a href=\"${appURL}\" target=\"_blank\" style=\"display: inline-block; color: #ffffff; background-color: #3498db; border: solid 1px #3498db; border-radius: 5px; box-sizing: border-box; cursor: pointer; text-decoration: none; font-size: 14px; font-weight: bold; margin: 0; padding: 12px 25px; text-transform: capitalize; border-color: #3498db;\">
                      Ouvrir l'application
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </p>
        </div>
      </div>
    </div>
    </body>`;

    return email;
}