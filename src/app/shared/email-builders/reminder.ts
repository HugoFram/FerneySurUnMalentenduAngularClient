
export function buildReminderEmail(firstname: string, matchNum: string, matchDate: Date, matchHour: string, matchPlace: string, opponent: string, opponentRank: string, previousEncounter: string, appURL: string): string {
    let email = `<body width="100%%" style="margin: 0; padding: 0 !important; mso-line-height-rule: exactly; background-color: #FFFFFF;">
    <div valign="middle" class="hero" style="background-size: cover; height: 400px;"> 
      <div class="text" style="padding: 0 3em; text-align: center;"> 
        <h2>Salut ${firstname},</h2> 
        <h3>Es-tu disponible pour le prochain match?</h3>
        <p>
          <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" style=\"border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: auto;\">
            <tbody>
              <tr>
                <td style=\"font-family: sans-serif; font-size: 14px; vertical-align: top; background-color: #3498db; border-radius: 5px; text-align: center;\"> 
                  <a href=\"${appURL}/next-match?matchNum=${matchNum}&playerName=${firstname}&available=yes\" target=\"_blank\" style=\"display: inline-block; color: #ffffff; background-color: #3498db; border: solid 1px #3498db; border-radius: 5px; box-sizing: border-box; cursor: pointer; text-decoration: none; font-size: 14px; font-weight: bold; margin: 0; padding: 12px 25px; text-transform: capitalize; border-color: #3498db;\">
                    Disponible
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </p>
        <br>
        <p>
          <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" style=\"border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: auto;\">
            <tbody>
              <tr>
                <td style=\"font-family: sans-serif; font-size: 14px; vertical-align: top; background-color: #3498db; border-radius: 5px; text-align: center;\"> 
                  <a href=\"${appURL}/next-match?matchNum=${matchNum}&playerName=${firstname}&available=maybe\" target=\"_blank\" style=\"display: inline-block; color: #ffffff; background-color: #3498db; border: solid 1px #3498db; border-radius: 5px; box-sizing: border-box; cursor: pointer; text-decoration: none; font-size: 14px; font-weight: bold; margin: 0; padding: 12px 25px; text-transform: capitalize; border-color: #3498db;\">
                    Disponible si besoin
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </p>
        <br>
        <p>
          <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" style=\"border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: auto;\">
            <tbody>
              <tr>
                <td style=\"font-family: sans-serif; font-size: 14px; vertical-align: top; background-color: #3498db; border-radius: 5px; text-align: center;\"> 
                  <a href=\"${appURL}/next-match?matchNum=${matchNum}&playerName=${firstname}&available=no\" target=\"_blank\" style=\"display: inline-block; color: #ffffff; background-color: #3498db; border: solid 1px #3498db; border-radius: 5px; box-sizing: border-box; cursor: pointer; text-decoration: none; font-size: 14px; font-weight: bold; margin: 0; padding: 12px 25px; text-transform: capitalize; border-color: #3498db;\">
                    Non disponible
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </p>
      </div>
      <div valign="middle" class="hero" style="background-size: cover; height: 400px;">
        <div class="card border-secondary mb-3" style="max-width: 100%%; text-align: center;">
          <div class="card-header"><h1>Match:</h1></div>
          <div class="card-body">
            <h3>
              <i class="far fa-calendar-alt"></i>
              ${matchDate.toLocaleDateString('fr-FR', {day: 'numeric', month: 'long', year: 'numeric'})}
              <small class="text-muted">(${matchDate.toLocaleDateString('fr-FR', {weekday: 'long'})})</small>
            </h3>
            <h3>
              <i class="far fa-clock"></i>
              ${matchHour}
            </h3>
            <h3>
              <i class="fas fa-map-marker-alt"></i>
              <a href="https://www.google.com/maps/search/?api=1&query=${matchPlace}">${matchPlace}</a>
            </h3>
            <h4>
              <strong>Adversaire:</strong>
              ${opponent}
              <small class="text-muted">(${opponentRank})</small>
            </h4>
            <h4>
              <strong>Précédente Rencontre:</strong>
              ${previousEncounter}
            </h4>
          </div>
        </div>
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