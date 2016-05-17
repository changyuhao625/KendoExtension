using KendoExtension.Models.KendoExt;
using KendoGridBinder;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace KendoExtension.Controllers
{
    public class KendoExtController : Controller
    {
        // GET: KendoExt
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult GetGridData(GridDTO model)
        {
            IList<GridDTO> gridlist = new List<GridDTO>();
            for (int i = 0; i < 100; i++)
            {
                gridlist.Add(new GridDTO()
                {
                    Name = string.Format("Harry{0}", i.ToString()),
                    Id = (i + 1)
                });
            }
            //Generate Fake Data
            return Json(new KendoGrid<GridDTO>(model.KendoGridRequest, gridlist));
        }
    }
}