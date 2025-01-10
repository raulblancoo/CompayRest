package com.tsw.CompayRest.Controller;

import com.tsw.CompayRest.Dto.BizumDto;
import com.tsw.CompayRest.Service.BizumService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/users/groups/{groupId}/bizums")
public class BizumController {

    private final BizumService bizumService;

    public BizumController(BizumService bizumService) {
        this.bizumService = bizumService;
    }

    @GetMapping
    public ResponseEntity<List<BizumDto>> getAllBizumsByGroupId(@PathVariable("groupId") Long groupId) {
        List<BizumDto> bizums = bizumService.findBizumsByGroupId(groupId);

        if (bizums.isEmpty()) {
            return ResponseEntity.noContent().build(); // HTTP 204
        }

        return ResponseEntity.ok(bizums); // HTTP 200
    }
}
