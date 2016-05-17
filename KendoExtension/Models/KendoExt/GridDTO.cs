using KendoGridBinder;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace KendoExtension.Models.KendoExt
{
    public class GridDTO
    {
        public KendoGridRequest KendoGridRequest { get; set; }
        public int Id { get; set; }
        public string Name { get; set; }
    }
}